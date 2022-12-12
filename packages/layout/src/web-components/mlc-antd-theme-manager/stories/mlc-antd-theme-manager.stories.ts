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
import { action } from '@storybook/addon-actions'
import type { Story } from '@storybook/web-components'
import { html } from 'lit'

import { MlcAntdThemeManager } from '../mlc-antd-theme-manager'

export default { title: 'Ant.d Theme Manager' }

customElements.define('mlc-antd-theme-manager', MlcAntdThemeManager)

function Template(props: MlcAntdThemeManager) {
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
