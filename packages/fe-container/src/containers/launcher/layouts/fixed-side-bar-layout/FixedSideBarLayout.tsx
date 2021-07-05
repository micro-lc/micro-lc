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
import {Layout, Menu} from 'antd'
import React, {useContext, useState} from 'react'
import PropTypes from 'prop-types'
import {Plugin} from '@mia-platform/core'

import {TopBar} from '@components/top-bar/TopBar'
import {LayoutContent} from '@components/layout-content/LayoutContent'
import {FooterBar} from '@components/footer-bar/FooterBar'
import {AppState} from '@hooks/useAppData/useAppData'
import {MenuOpenedContext} from '@contexts/MenuOpened.context'

import './FixedSideBarLayout.less'

type LoadedLauncherProps = Omit<AppState, 'isLoading'>

const menuItemMapper = (plugin: Plugin) => {
  return (
    <Menu.Item className='fixedSideMenu_voice' icon={<i className={'fixedSideMenu_icon ' + (plugin.icon || '')}/>} key={plugin.id}>
      <div className='fixedSideMenu_entry'>
        <span className='fixedSideMenu_label'>{plugin.label}</span>
        {plugin.integrationMode === 'href' && <i className='fas fa-external-link-alt sideMenu_externalLink'/>}
      </div>
    </Menu.Item>
  )
}

export const FixedSideBarLayout: React.FC<LoadedLauncherProps> = ({configuration}) => {
  const {isMenuOpened} = useContext(MenuOpenedContext)
  const [isCollapsed] = useState(false)
  return (
    <Layout>
      <Layout.Header className='launcher_header'>
        <TopBar/>
      </Layout.Header>
      <Layout>
        {
          isMenuOpened &&
          <Layout.Sider collapsed={isCollapsed} collapsible trigger={null}>
            <Menu className='fixedSideBar'>
              {configuration.plugins?.map(menuItemMapper)}
            </Menu>
          </Layout.Sider>
        }
        <Layout.Content className='launcher_content_container'>
          <LayoutContent/>
        </Layout.Content>
      </Layout>
      <Layout.Footer className='launcher_footer'>
        <FooterBar/>
      </Layout.Footer>
    </Layout>
  )
}

FixedSideBarLayout.propTypes = {
  configuration: PropTypes.any.isRequired
}
