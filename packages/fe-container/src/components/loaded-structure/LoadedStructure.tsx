import React, {useState} from 'react'
import {Layout} from 'antd'
import {Configuration} from '@mia-platform/core'

import {TopBar} from '../topbar/TopBar'
import {LayoutContent} from '../layout-content/LayoutContent'
import {ConfigurationProvider} from '../../contexts/Configuration.context'
import {MenuOpenedProvider} from '../../contexts/MenuOpened.context'

type LoadedStructureProps = {
  configuration: Configuration
}

// eslint-disable-next-line
export const LoadedStructure: React.FC<LoadedStructureProps> = ({configuration}) => {
  const [isMenuOpened, setMenuOpened] = useState(false)

  return (
    <ConfigurationProvider value={configuration}>
      <MenuOpenedProvider value={{isMenuOpened, setMenuOpened}}>
        <Layout>
          <Layout.Header>
            <TopBar/>
          </Layout.Header>
          <Layout.Content>
            <LayoutContent/>
          </Layout.Content>
        </Layout>
      </MenuOpenedProvider>
    </ConfigurationProvider>
  )
}
