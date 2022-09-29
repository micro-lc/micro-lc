import { action } from '@storybook/addon-actions'
import type { Story } from '@storybook/web-components'
import { html } from 'lit'

import type { MicrolcApiExtension } from '../lib/types'
import type { MlcLayout } from '../mlc-layout'
import '../mlc-layout'

export default { title: 'Layout' }

function Template(props: Partial<MlcLayout>) {
  return html`
    <mlc-layout
      .helpMenu=${props.helpMenu}
      .logo=${props.logo}
      .menuItems=${props.menuItems}
      .userMenu=${props.userMenu}
      .microlcApi=${props.microlcApi}
      .mode=${props.mode}
      .enableDarkMode=${props.enableDarkMode}
      .head=${props.head}
    >
      <div slot="top-bar" style="border: 1px solid darkred">Slot</div>
    </mlc-layout>
  `
}

const menuItems: MlcLayout['menuItems'] = [
  {
    icon: { library: '@ant-design/icons-svg', selector: 'BugOutlined' },
    id: 'application_1',
    label: { en: 'Application 1', it: 'Applicazione 1' },
    type: 'application',
  },
  {
    href: 'www.google.com',
    id: 'href_1',
    label: 'Link 1',
    target: '_blank',
    type: 'href',
  },
  {
    children: [
      {
        id: 'application_2',
        label: { en: 'Application 2', it: 'Applicazione 2' },
        type: 'application',
      },
      {
        children: [
          {
            id: 'application_3',
            label: { en: 'Application 1', it: 'Applicazione 1' },
            type: 'application',
          },
          {
            href: 'www.google.com',
            id: 'href_2',
            label: 'Link 2',
            target: '_blank',
            type: 'href',
          },
        ],
        id: 'group_1',
        label: { en: 'Group 1', it: 'Gruppo 1' },
        type: 'group',
      },
    ],
    id: 'category_1',
    label: { en: 'Category 1', it: 'Categoria 1' },
    type: 'category',
  },
]

// @ts-expect-error // We do not need to implement all the members
const microlcApiExtensions: MicrolcApiExtension = {
  head: {
    setIcon: attrs => action('extensions.head.setIcon')(attrs),
    setTitle: title => action('extensions.head.setTitle')(title),
  },
  httpClient: {
    get: url => {
      action('extensions.httpClient.get')(url)
      return Promise.resolve({ fullName: 'Edoardo Pessina' })
    },
  },
  language: {
    getLanguage: () => 'en',
    setLanguage: () => { /* no-op */ },
  },
}

// @ts-expect-error // We do not need to implement all the members
const microlcApi: MlcLayout['microlcApi'] = {
  getExtensions: () => microlcApiExtensions,
  router: {
    goToApplication: (id) => action('router.goToApplication')(id),
    open: (url, target) => action('router.open')(url, target),
  },
  setExtension: (key, val) => {
    action('setExtension')(key, val)
    return microlcApiExtensions
  },
}

export const TopBar = Template.bind({}) as unknown as Story<MlcLayout>
TopBar.storyName = 'Top bar menu'
TopBar.args = {
  enableDarkMode: true,
  head: {
    favIconUrl: 'https://www.favicourl.com',
    title: 'Tab title',
  },
  helpMenu: {
    helpLink: 'https://www.google.com',
  },
  logo: {
    href: 'https://www.ggogle.it',
    urlLightImage: 'https://avatars.githubusercontent.com/u/92730708?s=200&v=4',
  },
  menuItems,
  microlcApi,
  mode: 'topBar',
  userMenu: {
    logout: {
      method: 'POST',
      redirectUrl: 'https://www.redirecturl.com',
      url: 'https://www.userlogout.com',
    },
    userInfoUrl: 'https://www.userinfo.com',
    userPropertiesMapping: { fullName: 'name' },
  },
}

export const FixedSideBar = Template.bind({}) as unknown as Story<MlcLayout>
FixedSideBar.storyName = 'Fixed side bar'
FixedSideBar.args = {
  helpMenu: {
    helpLink: 'https://www.google.com',
  },
  logo: {
    urlLightImage: 'https://avatars.githubusercontent.com/u/92730708?s=200&v=4',
  },
  menuItems,
  microlcApi,
  mode: 'fixedSideBar',
  userMenu: {
    logout: {
      method: 'POST',
      redirectUrl: 'https://www.redirecturl.com',
      url: 'https://www.userlogout.com',
    },
    userInfoUrl: 'https://www.userinfo.com',
  },
}

export const OverlaySideBar = Template.bind({}) as unknown as Story<MlcLayout>
OverlaySideBar.storyName = 'Overlay side bar'
OverlaySideBar.args = {
  helpMenu: {
    helpLink: 'https://www.google.com',
  },
  logo: {
    urlLightImage: 'https://avatars.githubusercontent.com/u/92730708?s=200&v=4',
  },
  menuItems,
  microlcApi,
  mode: 'overlaySideBar',
  userMenu: {
    logout: {
      method: 'POST',
      redirectUrl: 'https://www.redirecturl.com',
      url: 'https://www.userlogout.com',
    },
    userInfoUrl: 'https://www.userinfo.com',
  },
}
