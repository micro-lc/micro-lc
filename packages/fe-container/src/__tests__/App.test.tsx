import React from 'react'
import {screen} from '@testing-library/react'
import nock from 'nock'
import userEvent from '@testing-library/user-event'

import App from '../App'
import RenderWithReactIntl from './utils'
import {CONFIGURATION_SERVICE, GET_USER_SERVICE} from '@constants'

nock.disableNetConnect()

describe('App test', () => {
  const configurationUrl = `${CONFIGURATION_SERVICE.BASE_URL}${CONFIGURATION_SERVICE.ENDPOINT}`
  const userUrl = `${GET_USER_SERVICE.BASE_URL}${GET_USER_SERVICE.ENDPOINT}`

  beforeEach(() => {
    nock('http://localhost')
      .persist()
      .get(configurationUrl)
      .reply(200, {
        theming: {
          header: {
            pageTitle: 'Mia Care',
            favicon: 'https://www.mia-platform.eu/static/img/favicon/apple-icon-60x60.png'
          },
          variables: {},
          logo: 'logo_url'
        },
        plugins: [{
          label: 'entry_1',
          id: '1',
          integrationMode: 'href',
          externalLink: {
            url: 'https://google.it',
            sameWindow: false
          }
        }, {
          id: 'not-supported',
          label: 'Href',
          icon: 'clipboard',
          integrationMode: 'href',
          pluginRoute: '/iframeTest',
          pluginUrl: 'https://www.google.com/webhp?igu=1'
        }, {
          id: 'plugin-test-3',
          label: 'IFrame',
          icon: 'clipboard',
          order: 3,
          integrationMode: 'iframe',
          pluginRoute: '/iframeTest',
          pluginUrl: 'https://www.google.com/webhp?igu=1'
        }]
      })
    nock('http://localhost')
      .get(userUrl)
      .reply(200, {
        email: 'mocked.user@mia-platform.eu',
        groups: [
          'users',
          'admin'
        ],
        name: 'Mocked User',
        nickname: 'mocked.user',
        phone: '+393333333333',
        picture: 'https://i2.wp.com/cdn.auth0.com/avatars/md.png?ssl=1'
      })
    RenderWithReactIntl(<App/>)
  })

  it('renders without crashing', async () => {
    expect(await screen.findByTestId('company-logo')).toBeTruthy()
  })

  it('toggle is working', async () => {
    const toggle = await screen.findByTestId('top-bar-side-menu-toggle')

    expect(global.window.document.title).toEqual('Mia Care')
    // @ts-ignore
    expect(screen.getByText('entry_1').parentElement.parentElement.parentElement.classList).not.toContain('opened')

    userEvent.click(toggle)
    // @ts-ignore
    expect(screen.getByText('entry_1').parentElement.parentElement.parentElement.classList).toContain('opened')

    userEvent.click(toggle)
    // @ts-ignore
    expect(screen.getByText('entry_1').parentElement.parentElement.parentElement.classList).not.toContain('opened')
  })

  it('navigate to first not href plugin', async () => {
    await screen.findByTestId('top-bar-side-menu-toggle')
    expect(window.location.href).toContain('/iframeTest')
  })
})
