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
import React, {useCallback, useContext, useState} from 'react'
import {Divider} from 'antd'

import {BurgerIcon} from '@components/burger-icon/BurgerIcon'
import {HelpIcon} from '@components/help-icon/HelpIcon'
import {ConfigurationContext} from '@contexts/Configuration.context'
import {UserMenu} from '@components/user-menu/UserMenu'
import {UserContext} from '@contexts/User.context'

import './TopBar.less'
import {DarkModeSwitch} from '../dark-mode-switch/DarkModeSwitch'

export const TopBar: React.FC = () => {
  const configuration = useContext(ConfigurationContext)
  const user = useContext(UserContext)
  const mustShowBurgerIcon = (configuration?.plugins || []).length > 1
  const logo = configuration.theming?.logo
  const [logoDarkTheme, setLogoDarkTheme] = useState(false)

  const logoClickHandler = useCallback(() => {
    window.open(configuration.theming?.logo.navigation_url)
  }, [configuration.theming?.logo.navigation_url])

  const switchLogo = useCallback(() => {
    setLogoDarkTheme((oldValue) => !oldValue)
  }, [])

  return (
    <div className='topBar_container'>
      {mustShowBurgerIcon && <BurgerIcon/>}
      <img
        alt={configuration.theming?.logo.alt || 'Logo'}
        className='logo'
        data-testid='company-logo'
        onClick = {logoClickHandler}
        src={logoDarkTheme ? logo?.url_dark_image : logo?.url_light_image}
      />
      <div className='topBar_rightSide'>
        <HelpIcon/>
        <Divider className='topBar_divider' type="vertical"/>
        <DarkModeSwitch toggleCallback= {switchLogo}/>
        {
          user.name &&
          <div className='topBar_userMenu'>
            <UserMenu {...user}/>
          </div>
        }
      </div>
    </div>
  )
}
