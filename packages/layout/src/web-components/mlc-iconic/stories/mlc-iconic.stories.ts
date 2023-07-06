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

import { MlcIconic } from '../mlc-iconic'

export default { title: 'Dynamic icon' }

customElements.define('mlc-iconic', MlcIconic)

function Template(props: Partial<MlcIconic>) {
  return html`
    <div style="width: calc(100% - 32px); display: flex; justify-content: center; padding: 32px 16px">
      <mlc-iconic
        style="width: 64px; height: 64px; fill: gray"
        .selector=${props.selector}
        .library=${props.library}
        .src="${props.src}"
      >
      </mlc-iconic>
    </div>
  `
}

export const Ant = Template.bind({}) as Story<MlcIconic>
Ant.storyName = 'Ant Design Icons'
Ant.args = {
  library: '@ant-design/icons-svg',
  selector: 'MessageOutlined',
}

export const Ph = Template.bind({}) as Story<MlcIconic>
Ph.storyName = 'Phosphor Icons'
Ph.args = {
  library: 'phosphor/fill',
  selector: 'address-book-fill',
}
