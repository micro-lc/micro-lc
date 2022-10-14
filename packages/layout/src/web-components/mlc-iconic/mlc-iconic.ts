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

  @state() _icon = emptyIcon

  protected updated(changedProperties: PropertyValues) {
    super.updated(changedProperties)

    renderIcon.call(this).catch(error)
  }

  protected createRenderRoot() {
    return this
  }

  protected render(): unknown {
    return this._icon
  }
}
