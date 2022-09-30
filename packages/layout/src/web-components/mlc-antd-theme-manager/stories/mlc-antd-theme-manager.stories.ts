import { action } from '@storybook/addon-actions'
import type { Story } from '@storybook/web-components'
import { html } from 'lit'

import type { MlcAntdThemeManager } from '../mlc-antd-theme-manager'

import '../mlc-antd-theme-manager'

export default { title: 'Ant.d Theme Manager' }

function Template(props: Partial<MlcAntdThemeManager>) {
  return html`
    <mlc-antd-theme-manager
      .microlcApi=${props.microlcApi}
      .varsPrefix=${props.varsPrefix}
      .primaryColor=${props.primaryColor}
      .infoColor=${props.infoColor}
      .successColor=${props.successColor}
      .processingColor=${props.processingColor}
      .errorColor=${props.errorColor}
      .warningColor=${props.warningColor}
    ></mlc-antd-theme-manager>
  `
}

const microlcApi: Partial<MlcAntdThemeManager['microlcApi']> = {
  getExtensions: () => ({
    css: {
      setStyle: styles => action('microlcApi.getExtensions.css.setStyle')(styles),
    },
  }),
}

export const Default = Template.bind({}) as unknown as Story<MlcAntdThemeManager>
Default.storyName = 'Ant.d Theme Manager'
Default.args = {
  errorColor: '#FF4D4F',
  infoColor: '#1890FF',
  microlcApi,
  primaryColor: '#25B864',
  processingColor: '#1890FF',
  successColor: '#52C41A',
  varsPrefix: 'my-prefix',
  warningColor: '#FAAD14',
}
