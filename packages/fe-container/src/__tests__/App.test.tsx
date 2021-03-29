import React from 'react'
import {screen} from '@testing-library/react'
import nock from 'nock'
import userEvent from '@testing-library/user-event'

import App from '../App'
import RenderWithReactIntl from './utils'
import {CONFIGURATION_SERVICE} from '@constants'

nock.disableNetConnect()

describe('App test', () => {
  const configurationUrl = `${CONFIGURATION_SERVICE.BASE_URL}${CONFIGURATION_SERVICE.ENDPOINT}`

  beforeEach(() => {
    RenderWithReactIntl(<App/>)
  })

  it('renders without crashing', async () => {
    const mockedResponse = nock('http://localhost')
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
        }]
      })

    expect(await screen.findByTestId('company-logo')).toBeTruthy()
    mockedResponse.done()
  })

  it('toggle is working', async () => {
    const mockedResponse = nock('http://localhost')
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
        }]
      })

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

    mockedResponse.done()
  })

  it('navigate to first not href plugin', async () => {
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

    await screen.findByTestId('top-bar-side-menu-toggle')
    expect(window.location.href).toContain('/iframeTest')
  })
})
