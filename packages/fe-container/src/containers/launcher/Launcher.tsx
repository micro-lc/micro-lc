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
import React, {useState} from 'react'
import {Layout} from 'antd'
import PropTypes from 'prop-types'
import {LoadingAnimation} from '@mia-platform/microlc-ui-components'

import {TopBar} from '@components/top-bar/TopBar'
import {LayoutContent} from '@components/layout-content/LayoutContent'
import {ConfigurationProvider} from '@contexts/Configuration.context'
import {MenuOpenedProvider} from '@contexts/MenuOpened.context'
import {AppState} from '@hooks/useAppData/useAppData'
import {SideMenu} from '@components/side-menu/SideMenu'
import {UserContextProvider} from '@contexts/User.context'
import {FooterBar} from '@components/footer-bar/FooterBar'

import './Launcher.less'
import {MENU_LOCATION} from '@constants'

export const Launcher: React.FC<AppState> = ({configuration, isLoading, user}) => {
  return (
    <>
      {
        isLoading ?
            <LoadingAnimation /> :
          <LoadedLauncher configuration={configuration} user={user}/>
      }
    </>
  )
}

type LoadedLauncherProps = Omit<AppState, 'isLoading'>

const LoadedLauncher: React.FC<LoadedLauncherProps> = ({configuration, user}) => {
  const showSideBar = !configuration.theming || [undefined, MENU_LOCATION.sideBar].includes(configuration.theming.menuLocation)

  return (
    <AppProvider configuration={configuration} user={user}>
      <Layout>
        <Layout.Header className='launcher_header'>
          <TopBar/>
        </Layout.Header>
        <Layout.Content className='launcher_content_container'>
          { showSideBar && <SideMenu plugins={configuration.plugins}/> }
          <LayoutContent/>
        </Layout.Content>
        <Layout.Footer className='launcher_footer'>
          <FooterBar />
        </Layout.Footer>
      </Layout>
    </AppProvider>
  )
}

const AppProvider: React.FC<LoadedLauncherProps> = ({configuration, user, children}) => {
  const [isMenuOpened, setMenuOpened] = useState(false)
  return (
    <ConfigurationProvider value={configuration}>
      <UserContextProvider value={user}>
        <MenuOpenedProvider value={{isMenuOpened, setMenuOpened}}>
          {children}
        </MenuOpenedProvider>
      </UserContextProvider>
    </ConfigurationProvider>
  )
}

LoadedLauncher.propTypes = {
  configuration: PropTypes.any.isRequired,
  user: PropTypes.any.isRequired
}

AppProvider.propTypes = {
  ...LoadedLauncher.propTypes
}

Launcher.propTypes = {
  ...LoadedLauncher.propTypes,
  isLoading: PropTypes.bool.isRequired
}
