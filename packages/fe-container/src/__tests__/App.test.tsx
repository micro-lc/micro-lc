/*
 * Copyright 2021 Mia srl
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react'
import {screen} from '@testing-library/react'
import nock from 'nock'
import userEvent from '@testing-library/user-event'

import App from '../App'
import RenderWithReactIntl from './utils'
import {CONFIGURATION_SERVICE, USER_CONFIGURATION_SERVICE} from '@constants'

nock.disableNetConnect()

describe('App test', () => {
  const configurationUrl = `${CONFIGURATION_SERVICE.BASE_URL}${CONFIGURATION_SERVICE.ENDPOINT}`
  const authUrl = `${USER_CONFIGURATION_SERVICE.BASE_URL}${USER_CONFIGURATION_SERVICE.ENDPOINT}`
  const userUrl = '/api/v1/microlc/user'

  beforeEach(() => {
    nock('http://localhost')
      .get(authUrl)
      .reply(200, {
        isAuthNecessary: true,
        userInfoUrl: userUrl
      })
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
          label: 'Href entry',
          id: '1',
          integrationMode: 'href',
          externalLink: {
            url: 'https://google.it',
            sameWindow: false
          }
        }, {
          id: 'iframe-google',
          label: 'iframe entry',
          icon: 'clipboard',
          integrationMode: 'iframe',
          pluginRoute: '/iframeTest',
          pluginUrl: 'https://www.google.com/webhp?igu=1'
        }, {
          id: 'plugin-test-3',
          label: 'Qiankun entry',
          icon: 'clipboard',
          order: 3,
          integrationMode: 'qiankun',
          pluginRoute: '/qiankunTest',
          pluginUrl: 'http://localhost:8764'
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
        picture: 'https://i2.wp.com/cdn.auth0.com/avatars/md.png?ssl=1'
      })
    nock('http://localhost:8764')
      .get('/')
      .reply(500)
    RenderWithReactIntl(<App/>)
  })

  const clickToggle = async () => {
    const toggle = await screen.findByTestId('top-bar-side-menu-toggle')
    userEvent.click(toggle)
  }

  it('renders without crashing', async () => {
    expect(await screen.findByTestId('company-logo')).toBeTruthy()
    expect(await screen.findByText('Mocked User')).toBeTruthy()
  })

  it('toggle is working', async () => {
    const toggle = await screen.findByTestId('top-bar-side-menu-toggle')

    // @ts-ignore
    const retrieveEntryClasses = () => screen.getByText('Href entry').parentElement.parentElement.parentElement.parentElement.classList

    expect(global.window.document.title).toEqual('Mia Care')

    expect(retrieveEntryClasses()).not.toContain('opened')

    userEvent.click(toggle)

    expect(retrieveEntryClasses()).toContain('opened')

    userEvent.click(toggle)

    expect(retrieveEntryClasses()).not.toContain('opened')
  })

  it('navigate to first not href plugin', async () => {
    await screen.findByTestId('top-bar-side-menu-toggle')
    expect(window.location.href).toContain('/iframeTest')
  })

  it('Correctly handle redirect', (done) => {
    clickToggle().then(() => {
      userEvent.click(screen.getByText('Qiankun entry'))
      setTimeout(() => {
        expect(window.location.href).toContain('/microlc_internal_error')
        done()
      }, 1000)
    })
  })
})
