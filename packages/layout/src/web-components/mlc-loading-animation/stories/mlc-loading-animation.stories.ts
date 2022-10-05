import type { Story } from '@storybook/web-components'
import { html } from 'lit'

import { MlcLoadingAnimation } from '../mlc-loading-animation'

export default { title: 'Loading Animation' }

customElements.define('mlc-loading-animation', MlcLoadingAnimation)

function Template(this: Partial<Story<MlcLoadingAnimation>>, { primaryColor }: MlcLoadingAnimation) {
  return html`
    <mlc-loading-animation .primaryColor=${primaryColor}>
      <div>Content</div>
    </mlc-loading-animation>
  `
}

export const Config = Template.bind({}) as Story<MlcLoadingAnimation>
Config.storyName = 'Default'
Config.args = {
  primaryColor: 'blue',
}
