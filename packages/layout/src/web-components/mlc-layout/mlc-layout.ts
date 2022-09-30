import type { MicrolcApi } from '@micro-lc/orchestrator'
import { html } from 'lit'
import { property, query, state } from 'lit/decorators.js'

import { MlcComponent } from '../../engine'
import type { Translations } from '../../lang'
import type { WrapperProps } from '../../react-components'
import { Wrapper } from '../../react-components'
import { cssResult } from '../../style'

import type { Head, HelpMenu, Logo, MenuItem, Mode, UserMenu } from './config'
import { DEFAULT_LANGUAGE, getCurrentLocale, getLang, loadTranslations } from './lib/translation-loader'
import type { MicrolcApiExtension, User } from './lib/types'
import { Theme } from './lib/types'
import { mapUserFields } from './lib/user'
import { createProps } from './mlc-layout.lib'

export class MlcLayout extends MlcComponent<WrapperProps> {
  static styles = [cssResult]

  @property({ attribute: 'mode' }) mode?: Mode = 'overlaySideBar'
  @property({ attribute: 'enable-dark-mode' }) enableDarkMode?: boolean = false

  @property({ attribute: false }) microlcApi?: Partial<MicrolcApi<MicrolcApiExtension>>
  @property({ attribute: false }) logo?: Logo
  @property({ attribute: false }) menuItems?: MenuItem[]
  @property({ attribute: false }) helpMenu?: HelpMenu
  @property({ attribute: false }) userMenu?: UserMenu
  @property({ attribute: false }) head?: Head

  @state() _user?: User

  // TODO: collapsed default value
  @state() _sideBarCollapsed = false

  // TODO: first selected key
  @state() _selectedKeys: string[] = []

  // TODO: get initial theme
  @state() _theme: Theme = Theme.LIGHT

  @state() _lang = DEFAULT_LANGUAGE
  @state() _locale: Translations['MLC-LAYOUT'] = undefined

  constructor() {
    super(Wrapper, createProps)
  }

  @query('#micro-lc-layout-container') container!: HTMLDivElement

  protected render(): unknown {
    return html`
      <div id="micro-lc-layout-container" style="height: 100%; overflow: hidden"></div>
    `
  }

  protected firstUpdated(_changedProperties: Map<PropertyKey, unknown>) {
    super.firstUpdated(_changedProperties)

    this.appendChild(this.ownerDocument.createElement('slot'))

    this.head?.title && this.microlcApi?.getExtensions?.().head?.setTitle(this.head.title)
    this.head?.favIconUrl && this.microlcApi?.getExtensions?.().head?.setIcon({ href: this.head.favIconUrl })

    this._lang = getLang(this.microlcApi)

    loadTranslations(this._lang)
      .then(() => { this._locale = getCurrentLocale().get(this.tagName) })
      .catch(() => { /* no-op */ })

    if (this.userMenu?.userInfoUrl) {
      this.microlcApi?.getExtensions?.().httpClient?.(this.userMenu.userInfoUrl)
        .then(res =>
          (res.ok
            ? res.json() as Promise<Record<string, unknown>>
            : Promise.reject(new TypeError('no user')))
        )
        .then(userInfo => {
          this._user = mapUserFields(userInfo, this.userMenu)

          this.microlcApi?.set?.({ user: userInfo })
          return this.microlcApi?.getCurrentApplication?.().handlers?.update?.({})
        })
        .catch(console.error)
    }
  }
}
