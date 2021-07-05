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
import {Divider, Layout, Menu} from 'antd'
import React, {useCallback, useContext, useState} from 'react'
import PropTypes from 'prop-types'
import {Plugin} from '@mia-platform/core'

import {TopBar} from '@components/top-bar/TopBar'
import {LayoutContent} from '@components/layout-content/LayoutContent'
import {FooterBar} from '@components/footer-bar/FooterBar'
import {AppState} from '@hooks/useAppData/useAppData'
import {MenuOpenedContext} from '@contexts/MenuOpened.context'

import './FixedSideBarLayout.less'
import {FormattedMessage} from 'react-intl'
import {retrievePluginStrategy} from '@utils/plugins/PluginsLoaderFacade'
import {onSelectHandler} from '@utils/menu/antMenuUnselectHandler'

type LoadedLauncherProps = Omit<AppState, 'isLoading'>

const COLLAPSE_KEY = 'collapse'

const menuItemMapper = (plugin: Plugin) => {
  const pluginStrategy = retrievePluginStrategy(plugin)
  return (
    <Menu.Item
      className='fixedSideMenu_voice'
      icon={<i className={'fixedSideMenu_icon ' + (plugin.icon || '')}/>}
      key={plugin.id}
      onClick={pluginStrategy.handlePluginLoad}
    >
      <div className='fixedSideMenu_entry'>
        <span className='fixedSideMenu_label'>{plugin.label}</span>
        {plugin.integrationMode === 'href' && <i className='fas fa-external-link-alt sideMenu_externalLink'/>}
      </div>
    </Menu.Item>
  )
}

export const FixedSideBarLayout: React.FC<LoadedLauncherProps> = ({configuration}) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const {isMenuOpened} = useContext(MenuOpenedContext)

  const collapseToggle = useCallback(() => setIsCollapsed(prev => !prev), [])

  const hrefPlugins = configuration.plugins?.filter(plugin => plugin.integrationMode === 'href').map(plugin => plugin.id) || []
  const unselectableKeys = [COLLAPSE_KEY, ...hrefPlugins]

  return (
    <Layout>
      <Layout.Header className='launcher_header'>
        <TopBar/>
      </Layout.Header>
      <Layout>
        {
          isMenuOpened &&
          <Layout.Sider collapsed={isCollapsed} collapsible trigger={null}>
            <Menu className='fixedSideBar' onSelect={onSelectHandler(unselectableKeys)}>
              <Menu.Item
                className='fixedSideMenu_voice'
                icon={<i className='fixedSideMenu_icon fas fa-compress-alt'/>}
                key={COLLAPSE_KEY}
                onClick={collapseToggle}
              >
                <CollapseItem/>
              </Menu.Item>
              <Divider className='divider'/>
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

const CollapseItem: React.FC = () => {
  return (
    <div className='fixedSideMenu_entry'>
      <FormattedMessage id={'collapse'}/>
    </div>
  )
}
