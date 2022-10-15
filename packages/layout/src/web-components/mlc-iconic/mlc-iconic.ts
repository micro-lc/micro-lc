import type { Library } from '@micro-lc/iconic'
import type { PropertyValues } from 'lit'
import { LitElement } from 'lit'
import { property, state } from 'lit/decorators.js'

import { error } from '../commons/logger'

import { emptyIcon, renderIcon } from './mlc-iconic.lib'

export class MlcIconic extends LitElement {
  @property({ attribute: 'selector' }) selector?: string
  @property({ attribute: 'library' }) library?: Library
  @property({ attribute: 'src' }) src?: string

  @state() private _icon = emptyIcon

  protected renderIcon = renderIcon.bind(this)

  protected update(changedProperties: PropertyValues) {
    super.update(changedProperties)

    if (
      changedProperties.has('selector')
        || changedProperties.has('library')
        || changedProperties.has('src')
    ) {
      this.renderIcon().then((template) => {
        this._icon = template
      }).catch(error)
    }
  }

  protected createRenderRoot() {
    return this
  }

  protected render(): unknown {
    return this._icon
  }
}
