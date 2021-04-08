import React, {useState} from 'react'
import {Layout, Skeleton} from 'antd'
import PropTypes from 'prop-types'

import {TopBar} from '@components/top-bar/TopBar'
import {LayoutContent} from '@components/layout-content/LayoutContent'
import {ConfigurationProvider} from '@contexts/Configuration.context'
import {MenuOpenedProvider} from '@contexts/MenuOpened.context'
import {AppState} from '@hooks/useAppData/useAppData'
import {SideMenu} from '@components/side-menu/SideMenu'
import {UserContextProvider} from '@contexts/User.context'

import './Launcher.less'

export const Launcher: React.FC<AppState> = ({configuration, isLoading, user}) => {
  return (
    <>
      {
        isLoading ?
          <Skeleton.Input active className='launcher_skeleton'/> :
          <LoadedLauncher configuration={configuration} user={user}/>
      }
    </>
  )
}

type LoadedLauncherProps = Omit<AppState, 'isLoading'>

const LoadedLauncher: React.FC<LoadedLauncherProps> = ({configuration, user}) => {
  return (
    <AppProvider configuration={configuration} user={user}>
      <Layout>
        <Layout.Header className='launcher_header'>
          <TopBar/>
        </Layout.Header>
        <Layout.Content>
          <SideMenu plugins={configuration.plugins}/>
          <LayoutContent/>
        </Layout.Content>
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
