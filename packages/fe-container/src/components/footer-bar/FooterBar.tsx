/*
 * Copyright 2021 Mia srl
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, {useContext, useEffect, useState} from 'react'
import {FormattedMessage} from 'react-intl'
import {Button} from 'antd'
import TagManager from 'react-gtm-module'
import PropTypes from 'prop-types'

import {ConfigurationContext} from '@contexts/Configuration.context'
import {AnalyticsSettings, retrieveAnalyticsSettings, saveSettings} from '@utils/settings/analytics/AnalyticsSettingsManager'

import {ReactComponent as Cookies} from './assets/cookies.svg'

import './FooterBar.less'

export const FooterBar: React.FC = () => {
  const configuration = useContext(ConfigurationContext)
  const [analyticsSettings, setAnalyticsSettings] = useState<AnalyticsSettings>(retrieveAnalyticsSettings())

  useEffect(() => {
    if (configuration.analytics && analyticsSettings.hasUserAccepted) {
      const {gtmId} = configuration.analytics
      TagManager.initialize({gtmId})
    }
    if (analyticsSettings.hasUserResponded) saveSettings(analyticsSettings)
  }, [configuration, analyticsSettings])

  return (
    <>
      { configuration.analytics && !analyticsSettings.hasUserResponded &&
        <div className='footerBar_container'>
          <Cookies className='cookies_svg'/>
          <div className='footerBar_rightSide'>
            <AnalyticsDisclaimer/>
            <AnalyticsButtons setAnalyticsSettings={setAnalyticsSettings}/>
          </div>
        </div>
      }
    </>
  )
}

const AnalyticsDisclaimer: React.FC = () => {
  const configuration = useContext(ConfigurationContext)

  return (
    <div className='cookie_policy'>
      <b className='cookie_policy_title'>
        <FormattedMessage id='cookie_policy'/>
      </b>
      <span>
        {configuration.analytics?.disclaimer}
        <a href={configuration.analytics?.privacyLink} target='blank'>
          <FormattedMessage id='privacyPolicy'/>
        </a>
      </span>
    </div>
  )
}

interface AnalyticsButtonProps {
  setAnalyticsSettings: (analyticsSettings: AnalyticsSettings) => void
}

const AnalyticsButtons: React.FC<AnalyticsButtonProps> = ({setAnalyticsSettings}) => {
  const answerHandler = (hasUserAccepted: boolean) => {
    return () => {
      setAnalyticsSettings({
        hasUserResponded: true,
        hasUserAccepted
      })
    }
  }

  return (
    <div className='footerBar_buttons'>
      <Button className="accept_button" onClick={answerHandler(true)} type='primary'>
        <FormattedMessage id="accept_button"/>
      </Button>
      <Button className="reject_button" onClick={answerHandler(false)}>
        <FormattedMessage id="decline_button"/>
      </Button>
    </div>
  )
}

AnalyticsButtons.propTypes = {
  setAnalyticsSettings: PropTypes.func.isRequired
}
