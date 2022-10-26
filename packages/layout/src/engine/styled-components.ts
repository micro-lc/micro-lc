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
import type { CSSResult, CSSResultOrNative, LitElement } from 'lit'
import { adoptStyles, unsafeCSS } from 'lit'

export interface StyledComponent extends LitElement {
  _adoptedStyleSheets: CSSResultOrNative[]
  stylesheet: string | undefined
}

export function adoptStylesheet<T extends StyledComponent>(this: T) {
  const { elementStyles = [] } = this.constructor as unknown as {elementStyles: CSSResult[] | undefined}

  this._adoptedStyleSheets.push(
    ...elementStyles.reduce<CSSResultOrNative[]>((sh, { styleSheet }) => {
      styleSheet && sh.push(styleSheet)
      return sh
    }, [])
  )

  this._adoptedStyleSheets.push(unsafeCSS(this.style.cssText))
}

export function adoptStylesOnShadowRoot(this: StyledComponent) {
  if (typeof this.stylesheet === 'string' && this.renderRoot instanceof ShadowRoot) {
    adoptStyles(this.renderRoot, this._adoptedStyleSheets)
  }
}
