/**
  Copyright 2022 Mia srl

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Layout, Menu } from 'antd'
import type { MenuProps } from 'antd'
import React, { useMemo } from 'react'

import type { Translations } from '../../lang'
import type { MenuItem, Mode } from '../../web-components/mlc-layout/types'
import type { AntMenuItem } from '../utils/menu'
import { buildAntMenuItems } from '../utils/menu'

export const COLLAPSE_KEY = 'micro_lc_fixed_side_bar_collapse'

export interface SideBarProps {
  collapsed?: boolean
  lang: string | undefined
  locale: Translations['MLC-LAYOUT'] | undefined
  menuItems: Partial<MenuItem>[]
  mode: Mode
  onSelect?: MenuProps['onSelect']
  selectedKeys: MenuProps['selectedKeys']
}

const getPopupContainer: MenuProps['getPopupContainer'] = menuDOMNode => {
  let currNode = menuDOMNode

  // We need to go up five elements otherwise the popup will remain trapped inside the Sider
  for (let i = 0; i < 5; i++) {
    currNode = currNode.parentElement as HTMLElement
  }

  return currNode
}

export const SideBar: React.FC<SideBarProps> = ({
  collapsed,
  lang,
  locale,
  menuItems,
  mode,
  onSelect,
  selectedKeys,
}) => {
  const menuItemsFromConfiguration = useMemo(() => buildAntMenuItems(menuItems, mode, lang), [lang, menuItems, mode])

  const antMenuItems: AntMenuItem[] = useMemo(() => {
    const fixedCollapseTrigger: AntMenuItem[] = [
      {
        icon: collapsed ? <RightOutlined/> : <LeftOutlined/>,
        key: COLLAPSE_KEY,
        label: locale?.collapse ?? 'Collapse',
        title: locale?.collapse ?? 'Collapse',
      },
      {
        type: 'divider',
      },
    ]

    return [
      ...(mode === 'fixedSideBar' ? fixedCollapseTrigger : []),
      ...menuItemsFromConfiguration,
    ]
  }, [locale, collapsed, menuItemsFromConfiguration, mode])

  return (
    <Layout.Sider
      className='layout-sider'
      collapsed={collapsed}
      collapsedWidth={mode === 'overlaySideBar' ? 0 : 80}
      collapsible
      theme='light'
      trigger={null}
    >
      <Menu
        // @ts-expect-error This property is private and should NOT be used. It is needed here to prevent the render of
        // the title tooltip when a menu item is hovered in collapsed mode, since the tooltip is appended outside the
        // shadow root and hence it does not get the style applied.
        _internalDisableMenuItemTitleTooltip={true}
        className='layout-sider-menu'
        getPopupContainer={getPopupContainer}
        items={antMenuItems}
        mode='inline'
        onSelect={onSelect}
        selectedKeys={selectedKeys}
      />
    </Layout.Sider>
  )
}
