import nock from 'nock'

import {finish, isCurrentPluginLoaded, registerPlugin} from '@utils/plugins/PluginsLoaderFacade'
import {CONFIGURATION_SERVICE, USER_CONFIGURATION_SERVICE} from '@constants'
import {renderHook} from '@testing-library/react-hooks'
import {useAppData} from '@hooks/useAppData/useAppData'

nock.disableNetConnect()

jest.mock('@utils/plugins/PluginsLoaderFacade', () => ({
  finish: jest.fn((param) => {
  }),
  isCurrentPluginLoaded: jest.fn(() => false),
  registerPlugin: jest.fn((param) => {
  }),
  retrievePluginStrategy: jest.fn((param) => ({
    handlePluginLoad: () => {}
  }))
}))

describe('Test useAppData hook', () => {
  const configurationUrl = `${CONFIGURATION_SERVICE.BASE_URL}${CONFIGURATION_SERVICE.ENDPOINT}`
  const authUrl = `${USER_CONFIGURATION_SERVICE.BASE_URL}${USER_CONFIGURATION_SERVICE.ENDPOINT}`
  const userUrl = '/api/v1/microlc/user'

  afterAll(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
  })

  it('Retrieve and apply configurations', async () => {
    const user = {
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

    const plugin1 = {
      id: 'not-supported',
      label: 'Href',
      icon: 'clipboard',
      integrationMode: 'href',
      pluginRoute: '/iframeTest',
      pluginUrl: 'https://www.google.com/webhp?igu=1',
      order: 1
    }

    const plugin2 = {
      label: 'entry_1',
      id: '1',
      integrationMode: 'href',
      order: 2,
      externalLink: {
        url: 'https://google.it',
        sameWindow: false
      }
    }

    const plugin3 = {
      id: 'plugin-test-3',
      label: 'IFrame',
      icon: 'clipboard',
      order: 3,
      integrationMode: 'iframe',
      pluginRoute: '/iframeTest',
      pluginUrl: 'https://www.google.com/webhp?igu=1'
    }

    const theming = {
      header: {
        pageTitle: 'Mia Care',
        favicon: 'https://www.mia-platform.eu/static/img/favicon/apple-icon-60x60.png'
      },
      variables: {
        primaryColor: 'red'
      },
      logo: 'logo_url'
    }

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
        theming,
        plugins: [plugin2, plugin1, plugin3]
      })
    nock('http://localhost')
      .get(userUrl)
      .reply(200, user)
    const {result, waitForNextUpdate} = renderHook(() => useAppData())
    const expectedState = {isLoading: false, user, configuration: {theming, plugins: [plugin1, plugin2, plugin3]}}
    await waitForNextUpdate()
    expect(document.title).toBe('Mia Care')
    // @ts-ignore
    expect(registerPlugin.mock.calls[0][0]).toMatchObject(plugin1)
    // @ts-ignore
    expect(registerPlugin.mock.calls[1][0]).toMatchObject(plugin2)
    // @ts-ignore
    expect(registerPlugin.mock.calls[2][0]).toMatchObject(plugin3)
    expect(registerPlugin).toHaveBeenCalledTimes(3)
    expect(finish).toHaveBeenCalledWith(user)
    expect(isCurrentPluginLoaded).toHaveBeenCalled()
    expect(result.current).toMatchObject(expectedState)
  })
})
