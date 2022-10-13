import type { WrapperProps } from '../../react-components'
import { COLLAPSE_KEY } from '../../react-components/SideBar'
import { error } from '../commons/logger'

import { setInLocalStorage } from './lib/local-storage'
import { getCurrentLocale, getLang, loadTranslations } from './lib/translation-loader'
import { mapUserFields } from './lib/user'
import type { Theme } from './lib/utils'
import { findMenuItemById } from './lib/utils'
import type { MlcLayout } from './mlc-layout'

export function loadLocale(this: MlcLayout) {
  if (this.locale) {
    this._locale = this.locale
    return
  }

  const microlcLang = this.microlcApi?.getExtensions?.().language?.getLanguage()
  this._lang = getLang(microlcLang)

  loadTranslations(this._lang)
    .then(() => { this._locale = getCurrentLocale().get(this.tagName) })
    .catch(error)
}

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

function onLogoClick(this: MlcLayout) {
  this.logo?.onClickHref && this.microlcApi?.router?.goTo(this.logo.onClickHref)
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

async function logout(this: MlcLayout) {
  const { logout: conf } = this.userMenu ?? {}

  if (conf?.url) {
    const response = await this.microlcApi?.getExtensions?.().httpClient?.(
      conf.url,
      { method: conf.method ?? 'POST' }
    )

    if (!response?.ok) { throw new Error('Error logging out user') }
  }

  conf?.redirectUrl && this.microlcApi?.router?.goTo(conf.redirectUrl)
}

function onUserMenuClick(this: MlcLayout, id: string) {
  if (id === 'logout') { logout.call(this).catch(error) }
}

// TODO: implement CSS dark mode switch
function onThemeChange(this: MlcLayout, value: Theme) {
  this._theme = value

  setInLocalStorage('@microlc:currentTheme', value)
  this.microlcApi?.set?.({ theme: value })
}

export function createProps(this: MlcLayout): WrapperProps {
  return {
    canLogout: Boolean(this.userMenu?.logout),
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
