import type { WrapperProps } from '../../react-components'
import { COLLAPSE_KEY } from '../../react-components/SideBar'

import { setInLocalStorage } from './lib/localStorage'
import type { Theme } from './lib/types'
import { mapUserFields } from './lib/user'
import { findMenuItemById } from './lib/utils'
import type { MlcLayout } from './mlc-layout'

export async function retrieveUser(this: MlcLayout) {
  if (!this.userMenu?.userInfoUrl) { return }

  const response = await this.microlcApi?.getExtensions?.().httpClient?.(this.userMenu.userInfoUrl)
  if (!response?.ok) { throw new Error('Could not retrieve user data') }

  const user = await response.json() as Record<string, unknown>
  this._user = mapUserFields(user, this.userMenu)

  this.microlcApi?.set?.({ user })
}

function onHelpMenuClick(this: MlcLayout) {
  this.helpMenu?.helpHref && this.microlcApi?.router?.open(this.helpMenu.helpHref, '_blank')
}

// TODO: should we one also an application?
function onLogoClick(this: MlcLayout) {
  this.logo?.onClickHref && this.microlcApi?.router?.open(this.logo.onClickHref)
}

function onSelect(this: MlcLayout, id: string) {
  if (id === COLLAPSE_KEY) {
    this._sideBarCollapsed = !this._sideBarCollapsed
    setInLocalStorage('@microlc:fixedSidebarState', this._sideBarCollapsed ? 'collapsed' : 'expanded')
    return
  }

  const menuItem = findMenuItemById(this.menuItems ?? [], id)

  if (menuItem?.type === 'application') {
    this._selectedKeys = [menuItem.id] as string[]
    menuItem.id && this.microlcApi?.router?.goToApplication(menuItem.id)
    return
  }

  if (menuItem?.type === 'href') {
    this.microlcApi?.router?.open(menuItem.href, menuItem.target)
  }
}

function onUserMenuClick(this: MlcLayout, id: string) {
  if (id !== 'logout') { return }

  const { logout } = this.userMenu ?? {}

  logout?.url && this.microlcApi?.getExtensions?.().httpClient?.(
    logout.url,
    { method: logout.method ?? 'POST' }
  )

  logout?.redirectUrl && this.microlcApi?.router?.open(logout.redirectUrl)
}

// TODO: implement CSS dark mode switch
function onThemeChange(this: MlcLayout, value: Theme) {
  this._theme = value

  setInLocalStorage('@microlc:currentTheme', value)
  this.microlcApi?.set?.({ theme: value })
}

export function createProps(this: MlcLayout): WrapperProps {
  return {
    // TODO: re-activate when dark mode is supported
    enableDarkMode: false,
    helpMenu: this.helpMenu,
    lang: this._lang,
    locale: this._locale,
    logo: this.logo,
    menuItems: this.menuItems,
    mode: this.mode,
    onHelpMenuClick: () => { onHelpMenuClick.call(this) },
    onLogoCLick: () => { onLogoClick.call(this) },
    onOverlaySideBarTriggerClick: () => { this._sideBarCollapsed = !this._sideBarCollapsed },
    onSelect: ({ key }) => { onSelect.call(this, key) },
    onThemeChange: newTheme => { onThemeChange.call(this, newTheme) },
    onUserMenuClick: ({ key }) => { onUserMenuClick.call(this, key) },
    selectedKeys: this._selectedKeys,
    sideBarCollapsed: this._sideBarCollapsed,
    theme: this._theme,
    user: this._user,
  }
}
