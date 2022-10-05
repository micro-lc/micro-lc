import type { Story } from '@storybook/web-components'
import { html } from 'lit'

import { MlcUrl } from '../mlc-url'

export default { title: 'URL' }

customElements.define('mlc-url', MlcUrl)

function Template(this: Partial<Story<MlcUrl>>) {
  return html`
    <mlc-url></mlc-url>
  `
}

export const Config = Template.bind({}) as Story<MlcUrl>
Config.storyName = 'Default'
Config.args = {}

