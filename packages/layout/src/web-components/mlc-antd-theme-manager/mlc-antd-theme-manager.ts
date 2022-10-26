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
import type { MicrolcApi, BaseExtension } from '@micro-lc/orchestrator'
import type { PropertyValues } from 'lit'
import { LitElement } from 'lit'
import { property } from 'lit/decorators.js'

import { createVariables } from './mlc-antd-theme-manager.lib'
import type { VarsPrefix } from './types'

export class MlcAntdThemeManager extends LitElement {
  microlcApi?: Partial<MicrolcApi<BaseExtension>>

  @property({ attribute: false }) varsPrefix: VarsPrefix = 'micro-lc'
  @property({ attribute: false }) nodes: Record<string, Record<string, string | number>> = {}
  @property({ attribute: 'primary-color' }) primaryColor = '#1890FF'
  @property({ attribute: 'info-color' }) infoColor = '#1890FF'
  @property({ attribute: 'success-color' }) successColor = '#52C41A'
  @property({ attribute: 'processing-color' }) processingColor = '#1890FF'
  @property({ attribute: 'error-color' }) errorColor = '#FF4D4F'
  @property({ attribute: 'warning-color' }) warningColor = '#FAAD14'
  @property({ attribute: 'font-family' }) fontFamily = '-apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, \'Helvetica Neue\',  Arial, \'Noto Sans\', sans-serif, \'Apple Color Emoji\', \'Segoe UI Emoji\', \'Segoe UI Symbol\', \'Noto Color Emoji\''

  protected updated(changedProperties: PropertyValues) {
    super.updated(changedProperties)

    const variables = createVariables.call(this)
    this.microlcApi?.getExtensions?.().css?.setStyle({ global: variables, nodes: this.nodes })
  }
}
