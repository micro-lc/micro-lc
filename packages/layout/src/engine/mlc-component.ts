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
