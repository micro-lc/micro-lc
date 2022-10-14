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

// export const FontAwesome = Template.bind({}) as Story<MlcIconic>
// FontAwesome.storyName = 'Font Awesome Icons'
// FontAwesome.args = {
//   library: '@fortawesome/free-regular-svg-icons',
//   selector: 'faCommentDots',
//   src: '../../../../../iconic/dist/far',
// }
