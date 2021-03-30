import nock from 'nock'

import {CONFIGURATION_SERVICE, GET_USER_SERVICE} from '@constants'
import {retrieveAppData} from '@services/microlc/microlc.service'

nock.disableNetConnect()

describe('microlc configuration service test', () => {
  const configurationUrl = `${CONFIGURATION_SERVICE.BASE_URL}${CONFIGURATION_SERVICE.ENDPOINT}`

  const userUrl = `${GET_USER_SERVICE.BASE_URL}${GET_USER_SERVICE.ENDPOINT}`

  beforeAll(() => {
    nock.cleanAll()
  })

  it('AppData test', (done) => {
    const configurationMock = {
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
    }

    nock('http://localhost')
      .persist()
      .get(configurationUrl)
      .reply(200, configurationMock)

    const userMock = {
      email: 'mocked.user@mia-platform.eu',
      groups: [
        'users',
        'admin'
      ],
      name: 'Mocked User',
      nickname: 'mocked.user',
      phone: '+393333333333',
      picture: 'https://i2.wp.com/cdn.auth0.com/avatars/md.png?ssl=1'
    }

    nock('http://localhost').get(userUrl).reply(200, userMock)

    retrieveAppData().subscribe(({configuration, user}) => {
      expect(configurationMock).toMatchObject(configuration)
      expect(userMock).toMatchObject(user)
      done()
    })
  })
})
