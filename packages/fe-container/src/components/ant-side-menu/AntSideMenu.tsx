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
import React, {useCallback, useState} from 'react'
import {Layout, Menu} from 'antd'
import {FormattedMessage} from 'react-intl'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {Configuration, Plugin} from '@mia-platform/core'

import {onSelectHandler} from '@utils/menu/antMenuUnselectHandler'
import {menuItemMapper} from '@utils/menu/menuItemMapper'
import {isFixedSidebarCollapsed, toggleFixedSidebarState} from '@utils/settings/side-bar/SideBarSettings'

import './AntSideMenu.less'

const COLLAPSE_KEY = 'collapse'

type LoadedLauncherProps = { configuration: Configuration }

export const AntSideMenu: React.FC<LoadedLauncherProps> = ({configuration}) => {
  const [isCollapsed, setIsCollapsed] = useState(isFixedSidebarCollapsed())

  const collapseToggle = useCallback(() => {
    setIsCollapsed(prev => !prev)
    toggleFixedSidebarState()
  }, [])

  const hrefPlugins = configuration.plugins
    ?.filter((plugin: Plugin) => plugin.integrationMode === 'href')
    .map((plugin: Plugin) => plugin.id) || []
  const unselectableKeys = [COLLAPSE_KEY, ...hrefPlugins]

  const collapseIconClassnames = classNames('sideMenu_icon', 'fas', {
    'fa-chevron-left': !isCollapsed,
    'fa-chevron-right': isCollapsed
  })

  return (
    <Layout.Sider collapsed={isCollapsed} collapsible trigger={null}>
      <Menu className='fixedSideBar' onSelect={onSelectHandler(unselectableKeys)}>
        <Menu.Item
          className='sideMenu_voice'
          icon={<i className={collapseIconClassnames}/>}
          key={COLLAPSE_KEY}
          onClick={collapseToggle}
          title={<FormattedMessage id={'expand'}/>}
        >
          <CollapseItem/>
        </Menu.Item>
        <Menu.Divider className='divider'/>
        {configuration.plugins?.map(menuItemMapper)}
      </Menu>
    </Layout.Sider>
  )
}

AntSideMenu.propTypes = {
  configuration: PropTypes.any.isRequired
}

const CollapseItem: React.FC = () => {
  return (
    <div className='sideMenu_entry'>
      <FormattedMessage id={'collapse'}/>
    </div>
  )
}
