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
