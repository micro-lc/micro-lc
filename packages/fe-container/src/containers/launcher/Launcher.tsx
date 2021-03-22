import React, {useState} from 'react'
import {Layout, Skeleton} from 'antd'
import {Configuration} from '@mia-platform/core'

import './Launcher.less'
import {TopBar} from '../../components/top-bar/TopBar'
import {LayoutContent} from '../../components/layout-content/LayoutContent'
import {ConfigurationProvider} from '../../contexts/Configuration.context'
import {MenuOpenedProvider} from '../../contexts/MenuOpened.context'

type LauncherProps = {
  configuration: Configuration;
  isLoading: boolean
}

// eslint-disable-next-line
export const Launcher: React.FC<LauncherProps> = ({configuration, isLoading}) => {
  const [isMenuOpened, setMenuOpened] = useState(false)

  return (
    <>{isLoading ?
      <Skeleton.Input active className='launcher_skeleton' /> :
        (
          <ConfigurationProvider value={configuration}>
            <MenuOpenedProvider value={{isMenuOpened, setMenuOpened}}>
              <Layout>
                <Layout.Header className='launcher_header'>
                  <TopBar/>
                </Layout.Header>
                <Layout.Content>
                  <LayoutContent/>
                </Layout.Content>
              </Layout>
            </MenuOpenedProvider>
          </ConfigurationProvider>
        )
    }</>
  )
}
