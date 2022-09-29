import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Layout, Menu } from 'antd'
import type { MenuProps } from 'antd'
import React, { useMemo } from 'react'

import type { MenuItem, Mode } from '../../config'
import type { Translations } from '../../lang'
import type { AntMenuItem } from '../utils/menu'
import { buildAntMenuItems } from '../utils/menu'

export const COLLAPSE_KEY = 'micro_lc_fixed_side_bar_collapse'

export interface SideBarProps {
  collapsed?: boolean
  lang: string | undefined
  locale: Translations['MLC-LAYOUT'] | undefined
  menuItems: MenuItem[]
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
        /*
        * This property is private and should NOT be used. It is needed here to prevent the render of the title tooltip
        * when a menu item is hovered in collapsed mode, since the tooltip is appended outside the shadow root and hence
        * it does not get the style applied.
        * TODO: we need to find a better way to overcome this issue
        */
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
