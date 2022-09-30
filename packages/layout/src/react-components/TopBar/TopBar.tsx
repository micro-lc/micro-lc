import { MenuFoldOutlined, MenuUnfoldOutlined, QuestionOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Button, Divider, Menu, Switch } from 'antd'
import React, { useMemo } from 'react'

import type { Translations } from '../../lang'
import type { HelpMenu, Logo, MenuItem, Mode } from '../../web-components/mlc-layout/config'
import type { OnThemeChange, User, VoidFn } from '../../web-components/mlc-layout/lib/types'
import { Theme } from '../../web-components/mlc-layout/lib/types'
import { UserMenu } from '../UserMenu'
import { buildAntMenuItems } from '../utils/menu'

export interface TopBarProps {
  enableDarkMode: boolean | undefined
  helpMenu: HelpMenu | undefined
  lang: string | undefined
  locale: Translations['MLC-LAYOUT'] | undefined
  logo: Logo | undefined
  menuItems: MenuItem[]
  mode: Mode
  onHelpMenuClick: VoidFn | undefined
  onLogoCLick: VoidFn | undefined
  onOverlaySideBarTriggerClick: VoidFn | undefined
  onSelect: MenuProps['onSelect'] | undefined
  onThemeChange: OnThemeChange | undefined
  onUserMenuClick: MenuProps['onClick'] | undefined
  selectedKeys: MenuProps['selectedKeys']
  sideBarCollapsed: boolean | undefined
  theme: Theme | undefined
  user: User | undefined
}

export const TopBar: React.FC<TopBarProps> = ({
  enableDarkMode,
  helpMenu,
  lang,
  locale,
  logo,
  menuItems,
  mode,
  onHelpMenuClick,
  onLogoCLick,
  onOverlaySideBarTriggerClick,
  onSelect,
  onThemeChange,
  onUserMenuClick,
  selectedKeys,
  sideBarCollapsed,
  theme,
  user,
}) => {
  const antMenuItems = useMemo(() => buildAntMenuItems(menuItems, mode, lang), [lang, menuItems, mode])

  const shouldRenderOverlaySideBarTrigger = mode === 'overlaySideBar'
  const shouldRenderMenu = mode === 'topBar' && menuItems.length > 0
  const shouldRenderHelp = helpMenu
  const shouldRenderThemeSwitch = enableDarkMode
  const shouldRenderUser = user?.name
  const shouldRenderDivider = shouldRenderUser && (shouldRenderMenu || shouldRenderHelp || shouldRenderThemeSwitch)

  return (
    <div className='top-bar-container'>
      {
        shouldRenderOverlaySideBarTrigger && (
          sideBarCollapsed
            ? (<MenuUnfoldOutlined className='top-bar-overlay-side-bar-trigger' onClick={onOverlaySideBarTriggerClick}/>)
            : (<MenuFoldOutlined className='top-bar-overlay-side-bar-trigger' onClick={onOverlaySideBarTriggerClick}/>)
        )
      }

      <img
        alt={logo?.altText ?? 'Logo'}
        className={`top-bar-logo ${logo?.href ? 'top-bar-logo-with-navigation' : ''}`}
        onClick={onLogoCLick}
        // TODO: handle dark theme
        src={logo?.urlLightImage}
      />

      {
        shouldRenderMenu && (
          <Menu
            className='top-bar-menu'
            getPopupContainer={menuDOMNode => menuDOMNode.parentElement as HTMLElement}
            items={antMenuItems}
            mode='horizontal'
            onSelect={onSelect}
            selectedKeys={selectedKeys}
          />
        )
      }

      <div className='top-bar-end'>
        <div className='top-bar-slot-container'>
          <slot name='top-bar'></slot>
        </div>

        { shouldRenderHelp && (<Button icon={<QuestionOutlined/>} onClick={onHelpMenuClick} shape='circle'/>) }

        {
          shouldRenderThemeSwitch && (
            <Switch
              checked={theme === Theme.DARK}
              checkedChildren={locale?.dark ?? 'Dark'}
              className='top-bar-theme-switch'
              onChange={val => onThemeChange?.(val ? Theme.DARK : Theme.LIGHT)}
              unCheckedChildren={locale?.light ?? 'Light'}
            />
          )
        }

        {
          shouldRenderUser && (
            <>
              {shouldRenderDivider && <Divider className='top-bar-divider' type='vertical'/> }
              <UserMenu locale={locale} onUserMenuClick={onUserMenuClick} user={user}/>
            </>
          )
        }
      </div>
    </div>
  )
}
