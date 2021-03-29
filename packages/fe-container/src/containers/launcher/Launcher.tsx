import React, {useState} from 'react'
import {Layout, Skeleton} from 'antd'
import PropTypes from 'prop-types'
import {Configuration} from '@mia-platform/core'

import {TopBar} from '@components/top-bar/TopBar'
import {LayoutContent} from '@components/layout-content/LayoutContent'
import {ConfigurationProvider} from '@contexts/Configuration.context'
import {MenuOpenedProvider} from '@contexts/MenuOpened.context'
import {AppState} from '@hooks/useAppData'
import {SideMenu} from '@components/side-menu/SideMenu'

import './Launcher.less'

export const Launcher: React.FC<AppState> = ({configuration, isLoading}) => {
  return (
    <>
      {
        isLoading ?
          <Skeleton.Input active className='launcher_skeleton'/> :
          <LoadedLauncher {...configuration}/>
      }
    </>
  )
}

Launcher.propTypes = {
  configuration: PropTypes.any.isRequired,
  isLoading: PropTypes.bool.isRequired
}

const LoadedLauncher: React.FC<Configuration> = (configuration) => {
  const [isMenuOpened, setMenuOpened] = useState(false)

  return (
    <ConfigurationProvider value={configuration}>
      <MenuOpenedProvider value={{isMenuOpened, setMenuOpened}}>
        <Layout>
          <Layout.Header className='launcher_header'>
            <TopBar/>
          </Layout.Header>
          <Layout.Content>
            <SideMenu plugins={configuration.plugins}/>
            <LayoutContent/>
          </Layout.Content>
        </Layout>
      </MenuOpenedProvider>
    </ConfigurationProvider>
  )
}
