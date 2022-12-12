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
import type { CSSResultOrNative, PropertyValueMap } from 'lit'
import { LitElement, unsafeCSS } from 'lit'
import { property } from 'lit/decorators.js'
import type React from 'react'
import type { FunctionComponent } from 'react'
import type { Root } from 'react-dom/client'

import type { LitCreatable } from './renderer'
import { createReactRoot, reactRender, unmount } from './renderer'
import type { StyledComponent } from './styled-components'
import { adoptStylesheet, adoptStylesOnShadowRoot } from './styled-components'

export class MlcComponent<P = { children?: React.ReactNode }> extends LitElement implements LitCreatable<P>, StyledComponent {
  protected dynamicStyleSheet?: string
  root?: Root
  _adoptedStyleSheets: CSSResultOrNative[] = []

  @property()
  set stylesheet(sheet: string | undefined) {
    this.dynamicStyleSheet = sheet
    this._adoptedStyleSheets.push(unsafeCSS(sheet))
  }

  get stylesheet(): string | undefined {
    return this.dynamicStyleSheet
  }

  Component: FunctionComponent<P>

  create?: () => P

  constructor(Component: FunctionComponent<P>, create?: () => P) {
    super()

    this.Component = Component
    create && (this.create = create.bind(this))

    adoptStylesheet.call(this)
  }

  private _shouldRenderWhenConnected = false

  protected firstUpdated(_changedProperties: PropertyValueMap<unknown> | Map<PropertyKey, unknown>): void {
    super.firstUpdated(_changedProperties)
    adoptStylesOnShadowRoot.call(this)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    createReactRoot.call(this)
  }

  protected updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties)
    reactRender.bind<(conditionalRender?: boolean) => void>(this)()
  }

  connectedCallback(): void {
    if (this._shouldRenderWhenConnected) {
      reactRender.bind<(conditionalRender?: boolean) => void>(this)()
      this._shouldRenderWhenConnected = false
    }

    super.connectedCallback()
  }

  disconnectedCallback(): void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    unmount.call(this)
    this._shouldRenderWhenConnected = true

    super.disconnectedCallback()
  }
}
