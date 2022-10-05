import type { MenuProps } from 'antd'
import { Layout } from 'antd'
import React from 'react'

import type { Translations } from '../../lang'
import type { Theme } from '../../web-components/mlc-layout/lib/utils'
import type { HelpMenu, Logo, MenuItem, Mode, User, VoidFn, OnThemeChange } from '../../web-components/mlc-layout/types'
import { SideBar } from '../SideBar'
import { TopBar } from '../TopBar'

export interface WrapperProps {
  enableDarkMode: boolean | undefined
  helpMenu: Partial<HelpMenu> | undefined
  lang: string | undefined
  locale: Translations['MLC-LAYOUT'] | undefined
  logo: Partial<Logo> | undefined
  menuItems: Partial<MenuItem>[] | undefined
  mode: Mode
  onHelpMenuClick: VoidFn | undefined
  onLogoCLick: VoidFn | undefined
  onOverlaySideBarTriggerClick: VoidFn | undefined
  onSelect: MenuProps['onSelect'] | undefined
  onThemeChange: OnThemeChange | undefined
  onUserMenuClick: MenuProps['onClick'] | undefined
  selectedKeys: MenuProps['selectedKeys'] | undefined
  sideBarCollapsed: boolean | undefined
  theme: Theme | undefined
  user: User | undefined
}

export const Wrapper: React.FC<WrapperProps> = ({
  enableDarkMode,
  helpMenu,
  lang,
  locale,
  logo,
  menuItems = [],
  mode,
  onHelpMenuClick,
  onLogoCLick,
  onOverlaySideBarTriggerClick,
  onSelect,
  onThemeChange,
  onUserMenuClick,
  selectedKeys = [],
  theme,
  sideBarCollapsed,
  user,
}) => {
  return (
    <>
      <Layout>
        <Layout.Header className='layout-header'>
          <TopBar
            enableDarkMode={enableDarkMode}
            helpMenu={helpMenu}
            lang={lang}
            locale={locale}
            logo={logo}
            menuItems={menuItems}
            mode={mode}
            onHelpMenuClick={onHelpMenuClick}
            onLogoCLick={onLogoCLick}
            onOverlaySideBarTriggerClick={onOverlaySideBarTriggerClick}
            onSelect={onSelect}
            onThemeChange={onThemeChange}
            onUserMenuClick={onUserMenuClick}
            selectedKeys={selectedKeys}
            sideBarCollapsed={sideBarCollapsed}
            theme={theme}
            user={user}
          />
        </Layout.Header>
      </Layout>

      <Layout className='layout-main' hasSider>
        {
          mode !== 'topBar' && (
            <SideBar
              collapsed={sideBarCollapsed}
              lang={lang}
              locale={locale}
              menuItems={menuItems}
              mode={mode}
              onSelect={onSelect}
              selectedKeys={selectedKeys}
            />
          )
        }

        <Layout.Content className='layout-content'>
          <slot></slot>
        </Layout.Content>
      </Layout>
    </>
  )
}
