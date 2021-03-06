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
import nock from 'nock'

import {CONFIGURATION_SERVICE, USER_CONFIGURATION_SERVICE} from '@constants'
import {retrieveAppData} from '@services/microlc/microlc.service'

nock.disableNetConnect()

describe('microlc configuration service test', () => {
  const configurationUrl = `${CONFIGURATION_SERVICE.BASE_URL}${CONFIGURATION_SERVICE.ENDPOINT}`
  const authUrl = `${USER_CONFIGURATION_SERVICE.BASE_URL}${USER_CONFIGURATION_SERVICE.ENDPOINT}`
  const userUrl = '/api/v1/microlc/user'

  const configurationMock = {
    theming: {
      header: {
        pageTitle: 'My Company',
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
  }

  beforeAll(() => {
    nock.cleanAll()
  })

  it('AppData test', (done) => {
    nock('http://localhost')
      .get(authUrl)
      .reply(200, {
        isAuthNecessary: true,
        authUrl: userUrl
      })

    nock('http://localhost').get(configurationUrl).reply(200, configurationMock)

    const userMock = {
      email: 'mocked.user@mia-platform.eu',
      groups: [
        'users',
        'admin'
      ],
      name: 'Mocked User',
      nickname: 'mocked.user',
      picture: 'https://i2.wp.com/cdn.auth0.com/avatars/md.png?ssl=1'
    }

    nock('http://localhost').get(userUrl).reply(200, userMock)

    retrieveAppData().subscribe(({configuration, user}) => {
      expect(configurationMock).toMatchObject(configuration)
      expect(userMock).toMatchObject(user)
      done()
    })
  })

  it('AppData without user', (done) => {
    nock('http://localhost')
      .get(authUrl)
      .reply(200, {isAuthNecessary: false})

    nock('http://localhost').get(configurationUrl).reply(200, configurationMock)
    retrieveAppData().subscribe(({configuration, user}) => {
      expect(configurationMock).toMatchObject(configuration)
      expect(user).toStrictEqual({})
      done()
    })
  })
})
