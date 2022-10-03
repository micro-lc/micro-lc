import type { Subscription } from '@micro-lc/orchestrator'
import { html } from 'lit'
import { property, query, state } from 'lit/decorators.js'

import { MlcComponent } from '../../engine'
import type { Translations } from '../../lang'
import type { WrapperProps } from '../../react-components'
import { Wrapper } from '../../react-components'
import { cssResult } from '../../style'

import type { Head, HelpMenu, Logo, MenuItem, Mode, UserMenu } from './config'
import { getFromLocalStorage } from './lib/localStorage'
import { DEFAULT_LANGUAGE, getCurrentLocale, getLang, loadTranslations } from './lib/translation-loader'
import type { MlcApi, User } from './lib/types'
import { Theme } from './lib/types'
import { createProps, retrieveUser } from './mlc-layout.lib'

export class MlcLayout extends MlcComponent<WrapperProps> {
  static styles = [cssResult]

  @property({ attribute: 'mode' }) mode: Mode = 'overlaySideBar'
  @property({ attribute: 'enable-dark-mode' }) enableDarkMode = false
  @property({ attribute: false }) microlcApi?: Partial<MlcApi>
  @property({ attribute: false }) logo?: Partial<Logo>
  @property({ attribute: false }) menuItems?: Partial<MenuItem>[]
  @property({ attribute: false }) helpMenu?: Partial<HelpMenu>
  @property({ attribute: false }) userMenu?: Partial<UserMenu>
  @property({ attribute: false }) head?: Partial<Head>

  @state() _user?: User
  @state() _sideBarCollapsed = false
  @state() _theme: Theme = Theme.LIGHT
  @state() _selectedKeys: string[] = []

  @state() _lang = DEFAULT_LANGUAGE
  @state() _locale: Translations['MLC-LAYOUT'] = undefined

  @query('#micro-lc-layout-container') container!: HTMLDivElement

  private _currentApplicationSub?: Subscription
  private _wasDisconnected = false

  constructor() {
    super(Wrapper, createProps)
  }

  protected render(): unknown {
    return html`
      <div id="micro-lc-layout-container" style="height: 100%; overflow: hidden"></div>
    `
  }

  connectedCallback() {
    super.connectedCallback()

    if (this._wasDisconnected) {
      this._currentApplicationSub = this.microlcApi?.currentApplication$
        ?.subscribe(currApplicationId => { if (currApplicationId) { this._selectedKeys = [currApplicationId] } })
    }

    this._wasDisconnected = false
  }

  protected firstUpdated(_changedProperties: Map<PropertyKey, unknown>) {
    super.firstUpdated(_changedProperties)

    /*
     * We need to append a slot as sibling of the component shadow DOM with the same name of the inner content slot (it is
     * unnamed in this case) in order to correctly mount any sibling of the layout (the orchestrator content in our case).
     */
    this.appendChild(this.ownerDocument.createElement('slot'))

    this.head?.title && this.microlcApi?.getExtensions?.().head?.setTitle(this.head.title)
    this.head?.favIconUrl && this.microlcApi?.getExtensions?.().head?.setIcon({ href: this.head.favIconUrl })

    const microlcLang = this.microlcApi?.getExtensions?.().language?.getLanguage()
    this._lang = getLang(microlcLang)

    loadTranslations(this._lang)
      .then(() => { this._locale = getCurrentLocale().get(this.tagName) })
      // TODO: use logger from micro-lc
      .catch(console.error)

    // TODO: use logger from micro-lc
    retrieveUser.call(this).catch(console.error)

    this._currentApplicationSub = this.microlcApi?.currentApplication$
      ?.subscribe(currApplicationId => { if (currApplicationId) { this._selectedKeys = [currApplicationId] } })

    this._sideBarCollapsed = getFromLocalStorage('@microlc:fixedSidebarState') === 'collapsed'
    this._theme = getFromLocalStorage('@microlc:currentTheme') ?? Theme.LIGHT
  }

  disconnectedCallback() {
    super.disconnectedCallback()

    this._currentApplicationSub?.unsubscribe()
    this._wasDisconnected = true
  }
}
