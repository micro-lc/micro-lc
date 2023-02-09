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
import { html } from 'lit'
import { property, query, state } from 'lit/decorators.js'

import { MlcComponent } from '../../engine'
import type { Translations } from '../../lang'
import type { WrapperProps } from '../../react-components'
import { Wrapper } from '../../react-components'
import { cssResult } from '../../style'
import { error } from '../commons/logger'

import { getFromLocalStorage } from './lib/local-storage'
import { DEFAULT_LANGUAGE } from './lib/translation-loader'
import { Theme } from './lib/utils'
import { createProps, loadLocale, retrieveUser, updateSelectedKeys } from './mlc-layout.lib'
import type { MlcApi, User, Head, HelpMenu, Logo, MenuItem, Mode, UserMenu } from './types'

export class MlcLayout extends MlcComponent<WrapperProps> {
  static styles = [cssResult]

  microlcApi?: Partial<MlcApi>

  private _currentApplicationSub?: ReturnType<MlcApi['subscribe']>
  private _wasDisconnected = false

  @property({ attribute: 'mode' }) mode: Mode = 'overlaySideBar'
  @property({ attribute: 'enable-dark-mode' }) enableDarkMode = false
  @property({ attribute: false }) logo?: Partial<Logo>
  @property({ attribute: false }) menuItems?: Partial<MenuItem>[]
  @property({ attribute: false }) helpMenu?: Partial<HelpMenu>
  @property({ attribute: false }) userMenu?: Partial<UserMenu>
  @property({ attribute: false }) head?: Partial<Head>
  @property({ attribute: false }) locale?: Translations['MLC-LAYOUT']

  @state() _user?: User
  @state() _sideBarCollapsed = false
  @state() _theme: Theme = Theme.LIGHT
  @state() _selectedKeys: string[] = []
  @state() _lang = DEFAULT_LANGUAGE
  @state() _locale: Translations['MLC-LAYOUT'] = undefined

  @query('#micro-lc-layout-container') container!: HTMLDivElement

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
        ?.subscribe(updateSelectedKeys.bind(this))
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

    loadLocale.call(this)

    retrieveUser.call(this).catch(error)

    this._currentApplicationSub = this.microlcApi?.currentApplication$
      ?.subscribe(updateSelectedKeys.bind(this))

    this._sideBarCollapsed = getFromLocalStorage.call(this, '@microlc:fixedSidebarState') === 'collapsed'
    this._theme = getFromLocalStorage
      .call<MlcLayout, ['@microlc:currentTheme'], Theme | undefined>(this, '@microlc:currentTheme') ?? Theme.LIGHT
  }

  disconnectedCallback() {
    super.disconnectedCallback()

    this._currentApplicationSub?.unsubscribe()
    this._wasDisconnected = true
  }
}
