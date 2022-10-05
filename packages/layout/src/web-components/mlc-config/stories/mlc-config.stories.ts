import type { Story } from '@storybook/web-components'
import { html } from 'lit'

import { MlcConfig } from '../mlc-config'

export default { title: 'Config' }

customElements.define('mlc-config', MlcConfig)

function Template(this: Partial<Story<MlcConfig>>, { microlcApi }: Partial<MlcConfig>) {
  return html`
    <mlc-config
      .microlcApi=${microlcApi}
    >
      <div style="height: 100%; display: flex; justify-content: center; align-items: center">
        <iframe style="height: 100%; width: 100%; border: none;" src="./_iframe.html"></iframe>
      </div>
    </mlc-config>
  `
}

export const Config = Template.bind({}) as Story<MlcConfig>
Config.storyName = 'Default'
Config.args = {
  microlcApi: {
    getCurrentConfig: () => ({
      applications: { 'micro-lc': {
        config: './config.json',
        entry: './',
        integrationMode: 'compose',
        route: './',
      } },
      importmap: {},
      layout: { content: { tag: 'slot' } },
      settings: {
        '4xx': {},
        '5xx': {},
        composerUri: './composer.development.js',
        defaultUrl: '/',
        mountPoint: { attributes: { id: '__MICRO_LC_MOUNT_POINT' }, tag: 'div' },
        mountPointSelector: '__MICRO_LC_MOUNT_POINT',
      },
      shared: {},
      version: 2,
    }),
  },
}
