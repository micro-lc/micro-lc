import type { MenuItem } from '../config'
import type { WrapperProps } from '../react-components'
import { COLLAPSE_KEY } from '../react-components/SideBar'

import type { Theme } from './lib/types'
import type { MlcLayout } from './mlc-layout'

function onHelpMenuClick(this: MlcLayout) {
  this.helpMenu?.helpLink && this.microlcApi?.router.open(this.helpMenu.helpLink, '_blank')
}

// TODO: should we one also an application?
function onLogoClick(this: MlcLayout) {
  this.logo?.href && this.microlcApi?.router.open(this.logo.href)
}

function findMenuItemById(menuItems: MenuItem[], id: string): MenuItem | undefined {
  for (const menuItem of menuItems) {
    if (menuItem.id === id) { return menuItem }

    if ('children' in menuItem) {
      const foundInChildren = findMenuItemById(menuItem.children ?? [], id)
      if (foundInChildren) { return foundInChildren }
    }
  }
}

function onSelect(this: MlcLayout, id: string) {
  if (id === COLLAPSE_KEY) {
    this._sideBarCollapsed = !this._sideBarCollapsed
    return
  }

  const menuItem = findMenuItemById(this.menuItems ?? [], id)

  if (menuItem?.type === 'application') {
    this._selectedKeys = [menuItem.id] as string[]
    this.microlcApi?.router.goToApplication(menuItem.id)
    return
  }

  if (menuItem?.type === 'href') {
    this.microlcApi?.router.open(menuItem.href, menuItem.target)
  }
}

// TODO: implement logout
function onUserMenuClick(this: MlcLayout, id: string) {
  if (id === 'logout') { console.log('TODO: onLogout') }
}

// TODO: implement dark mode switch
function onThemeChange(this: MlcLayout, value: Theme) {
  this._theme = value
}

export function createProps(this: MlcLayout): WrapperProps {
  return {
    enableDarkMode: this.enableDarkMode,
    helpMenu: this.helpMenu,
    lang: this._lang,
    locale: this._locale,
    logo: this.logo,
    menuItems: this.menuItems,
    mode: this.mode,
    onHelpMenuClick: () => { onHelpMenuClick.bind(this)() },
    onLogoCLick: () => { onLogoClick.bind(this)() },
    onOverlaySideBarTriggerClick: () => { this._sideBarCollapsed = !this._sideBarCollapsed },
    onSelect: ({ key }) => { onSelect.bind(this)(key) },
    onThemeChange: newTheme => { onThemeChange.bind(this)(newTheme) },
    onUserMenuClick: ({ key }) => { onUserMenuClick.bind(this)(key) },
    selectedKeys: this._selectedKeys,
    sideBarCollapsed: this._sideBarCollapsed,
    theme: this._theme,
    user: this._user,
  }
}
