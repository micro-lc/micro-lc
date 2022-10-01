import type { MicrolcApi, BaseExtension } from '@micro-lc/orchestrator'
import type { PropertyValues } from 'lit'
import { LitElement } from 'lit'
import { property } from 'lit/decorators.js'

import type { VarsPrefix } from './config'
import { createVariables } from './mlc-antd-theme-manager.lib'

export class MlcAntdThemeManager extends LitElement {
  @property({ attribute: false }) microlcApi?: Partial<MicrolcApi<BaseExtension>>
  @property({ attribute: false }) varsPrefix: VarsPrefix = 'micro-lc'

  @property({ attribute: 'primary-color' }) primaryColor = '#1890FF'
  @property({ attribute: 'info-color' }) infoColor = '#1890FF'
  @property({ attribute: 'success-color' }) successColor = '#52C41A'
  @property({ attribute: 'processing-color' }) processingColor = '#1890FF'
  @property({ attribute: 'error-color' }) errorColor = '#FF4D4F'
  @property({ attribute: 'warning-color' }) warningColor = '#FAAD14'
  @property({ attribute: 'font-family' }) fontFamily = '-apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, \'Helvetica Neue\',  Arial, \'Noto Sans\', sans-serif, \'Apple Color Emoji\', \'Segoe UI Emoji\', \'Segoe UI Symbol\', \'Noto Color Emoji\''

  @property({ attribute: false }) nodes: Record<string, Record<string, string>> = {}

  protected updated(changedProperties: PropertyValues) {
    super.updated(changedProperties)

    const variables = createVariables.call(this)
    this.microlcApi?.getExtensions?.().css?.setStyle({ global: variables, nodes: this.nodes })
  }
}
