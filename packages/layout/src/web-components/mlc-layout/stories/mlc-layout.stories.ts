import type { BaseExtension } from '@micro-lc/orchestrator'
import { action } from '@storybook/addon-actions'
import type { Story } from '@storybook/web-components'
import { html } from 'lit'

import { MlcLayout } from '../mlc-layout'
import type { MlcApi } from '../types'

export default { title: 'Layout' }

customElements.define('mlc-layout', MlcLayout)

function Template(props: Partial<MlcLayout>) {
  return html`
    <mlc-layout
      .helpMenu=${props.helpMenu}
      .logo=${props.logo}
      .menuItems=${props.menuItems}
      .userMenu=${props.userMenu}
      .microlcApi=${props.microlcApi}
      .mode=${props.mode ?? 'fixedSideBar'}
      .enableDarkMode=${props.enableDarkMode ?? false}
      .head=${props.head}
      .locale=${props.locale}
    >
      <div slot="top-bar" style="height: 100%; display: flex; justify-content: center; align-items: center">
        <div style="background: red; width: 24px; height: 24px"></div>
      </div>
      <div style="height: 100%; display: flex; justify-content: center; align-items: center">Content</div>
    </mlc-layout>
  `
}

const logo: MlcLayout['logo'] = {
  altText: 'My company',
  onClickHref: 'https://www.ggogle.it',
  url: {
    urlDarkImage: 'https://avatars.githubusercontent.com/u/92730708?s=200&v=4',
    urlLightImage: 'https://avatars.githubusercontent.com/u/92730708?s=200&v=4',
  },
}

const userMenu: MlcLayout['userMenu'] = {
  logout: {
    method: 'POST',
    redirectUrl: './',
    url: 'https://www.userlogout.com',
  },
  userInfoUrl: 'https://www.userinfo.com',
  userPropertiesMapping: { fullName: 'name' },
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
    icon: { library: '@ant-design/icons-svg', selector: 'MessageOutlined' },
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
            icon: { library: '@ant-design/icons-svg', selector: 'MessageOutlined' },
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

// @ts-expect-error // We do not need to implement all methods of the interface
const microlcApiExtensions: BaseExtension = {
  head: {
    setIcon: attrs => action('extensions.head.setIcon')(attrs),
    setTitle: title => action('extensions.head.setTitle')(title),
  },
  httpClient: (url, opts) => {
    action('extensions.httpClient')(url, opts)

    if (url === userMenu.userInfoUrl) {
      return Promise.resolve(new Response(JSON.stringify({ fullName: 'Edoardo Pessina' })))
    }

    return Promise.resolve(new Response(JSON.stringify({})))
  },
  language: {
    getLanguage: () => {
      action('language.getLanguage')
      return 'it'
    },
    setLanguage: () => action('language.setLanguage'),
  },
}

const microlcApi: Partial<MlcApi> = {
  currentApplication$: {
    subscribe: () => {
      action('currentApplication$.subscribe')()
      return {
        closed: false,
        unsubscribe: () => action('currentApplication$.subscribe')(),
      }
    },
  },
  getExtensions: () => microlcApiExtensions,
  router: {
    goTo: url => action('router.goTo')(url),
    goToApplication: async (id): Promise<void> => {
      action('router.goToApplication')(id)
      return Promise.resolve()
    },
    goToErrorPage: (status) => action('route.goToErrorPage')(status),
    open: (url, target) => {
      action('router.open')(url, target)
      return null
    },
    pushState: (data, unused, url) => action('route.pushState')(data, unused, url),
    replaceState: (data, unused, url) => action('route.replaceState')(data, unused, url),
  },
  set: event => action('set')(event),
  setExtension: (key, val) => {
    action('setExtension')(key, val)
    return microlcApiExtensions
  },
}

export const TopBar = Template.bind({}) as Story<MlcLayout>
TopBar.storyName = 'Top bar menu'
TopBar.args = {
  enableDarkMode: true,
  head: {
    favIconUrl: 'https://www.favicourl.com',
    title: 'Tab title',
  },
  helpMenu: { helpHref: 'https://docs.mia-platform.eu/' },
  logo,
  menuItems,
  microlcApi,
  mode: 'topBar',
  userMenu,
}

export const FixedSideBar = Template.bind({}) as Story<MlcLayout>
FixedSideBar.storyName = 'Fixed side bar'
FixedSideBar.args = {
  helpMenu: { helpHref: 'https://docs.mia-platform.eu/' },
  logo,
  menuItems,
  microlcApi,
  mode: 'fixedSideBar',
  userMenu,
}

export const OverlaySideBar = Template.bind({}) as Story<MlcLayout>
OverlaySideBar.storyName = 'Overlay side bar'
OverlaySideBar.args = {
  helpMenu: { helpHref: 'https://docs.mia-platform.eu/' },
  logo,
  menuItems,
  microlcApi,
  mode: 'overlaySideBar',
  userMenu,
}

export const CustomLocale = Template.bind({}) as Story<MlcLayout>
CustomLocale.storyName = 'With custom locale'
CustomLocale.args = {
  helpMenu: { helpHref: 'https://docs.mia-platform.eu/' },
  locale: {
    collapse: 'zusammenbrechen',
    dark: 'dunkel',
    light: 'leicht',
    logout: 'Abmeldung',
  },
  logo,
  menuItems,
  microlcApi,
  mode: 'fixedSideBar',
  userMenu,
}
