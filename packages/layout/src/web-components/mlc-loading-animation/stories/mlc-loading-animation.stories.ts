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
Config.storyName = 'Loading Animation'
Config.args = {
  primaryColor: 'blue',
}
