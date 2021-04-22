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
import {retrieveCookies, setCookies} from '@utils/cookies/CookiesManager'

import './FooterBar.less'

export const FooterBar: React.FC = () => {
  const [userHasAccepted, setUserHasAccepted] = useState<boolean>(false)

  // TODO
  useEffect(() => {
    // if retrieveCookies is not empty and user has accepted
    retrieveCookies() && setUserHasAccepted(true)
    // else nothing
  }, [])

  return (
      <div>
          {!userHasAccepted ?
            <FooterContent setUserHasAccepted = {setUserHasAccepted} userHasAccepted = {userHasAccepted} /> :
            < div></div>
            }
      </div>
  )
}

const footerProps = {
  setUserHasAccepted: PropTypes.any.isRequired,
  userHasAccepted: PropTypes.any.isRequired
}

type FooterProps = PropTypes.InferProps<typeof footerProps>

const FooterContent: React.FC<FooterProps> = ({userHasAccepted, setUserHasAccepted}) => {
  const configuration = useContext(ConfigurationContext)

  // TODO: Implement both handlers accept and decline handlers
  const clickHandler = () => {
    setCookies()
    setUserHasAccepted(true)
  }

  return (
    <div className='footerBar_container'>
        <Cookies className='cookies_svg' />
        <div className = 'footerBar_rightSide'>
            <div>
                <b>
                <FormattedMessage id="cookie_policy"/>
                </b>
                <p>
                    {configuration.analytics?.disclaimer}
                    <a href = {configuration.analytics?.privacyLink} target='blank' >{'Privacy Policy'}</a>
                </p>
            </div>
            {/* VERY IMPORTANT ON CLICK SETCOOKIES FROM FUNCTIONS AND SET STATE */}
            <div className='footerBar_buttons'>
                <Button className="accept_button" onClick={clickHandler} type='primary'>
                    <FormattedMessage id="accept_button"/>
                </Button>
                <Button className ="reject_button">
                    <FormattedMessage id="decline_button"/>
                </Button>
            </div>
        </div>
    </div>
  )
}
FooterContent.propTypes = footerProps
