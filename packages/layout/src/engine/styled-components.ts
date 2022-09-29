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
