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

import {ConfigurationContext} from '@contexts/Configuration.context'
import {ReactComponent as Cookies} from './assets/cookies.svg'
import {FormattedMessage} from 'react-intl'
import {Button} from 'antd'
import PropTypes from 'prop-types'
import {retrieveSettings, setSettings} from '@utils/settings/SettingsManager'
import TagManager from 'react-gtm-module'

import './FooterBar.less'

export const FooterBar: React.FC = () => {
  const configuration = useContext(ConfigurationContext)
  const [userHasAccepted, setUserHasReplied] = useState<boolean>(false)

  useEffect(() => {
    if (configuration.analytics) {
      const {gtmId} = configuration.analytics
      const settings = retrieveSettings('settings')
      if (settings) {
        setUserHasReplied(true)
        const settingsObject = JSON.parse(settings)
        settingsObject?.hasAccepted && TagManager.initialize({gtmId})
      }
    } else {
      setUserHasReplied(true)
    }
  }, [configuration.analytics])

  return (
      <div>
          {!userHasAccepted ?
            <FooterContent setUserHasReplied = {setUserHasReplied} userHasAccepted = {userHasAccepted} /> :
            <div></div>
            }
      </div>
  )
}

const footerProps = {
  setUserHasReplied: PropTypes.any.isRequired,
  userHasAccepted: PropTypes.any.isRequired
}

type FooterProps = PropTypes.InferProps<typeof footerProps>

const FooterContent: React.FC<FooterProps> = ({userHasAccepted, setUserHasReplied}) => {
  const configuration = useContext(ConfigurationContext)

  const acceptHandler = () => {
    setSettings('settings', true)
    setUserHasReplied(true)
  }

  const rejectHandler = () => {
    setSettings('settings', false)
    setUserHasReplied(true)
  }

  return (
    <div className='footerBar_container' data-testid='footer' >
        <Cookies className='cookies_svg' />
        <div className = 'footerBar_rightSide'>
            <div className='banner_text'>
                <b>
                <FormattedMessage id="cookie_policy"/>
                </b>
                <span>
                    {configuration.analytics?.disclaimer}
                    <a href = {configuration.analytics?.privacyLink} target='blank' >{'Privacy Policy'}</a>
                </span>
            </div>
            <div className='footerBar_buttons'>
                <Button className="accept_button" data-testid='accept_button' onClick={acceptHandler} type='primary'>
                    <FormattedMessage id="accept_button"/>
                </Button>
                <Button className ="reject_button" data-testid='reject_button' onClick={rejectHandler}>
                    <FormattedMessage id="decline_button"/>
                </Button>
            </div>
        </div>
    </div>
  )
}
FooterContent.propTypes = footerProps
