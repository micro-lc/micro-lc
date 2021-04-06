import {routeStrategy} from '@utils/plugins/strategies/RouteStrategy'
import {history} from '@utils/plugins/PluginsLoaderFacade'

jest.mock('history', () => ({
  createBrowserHistory: jest.fn((params) => ({
    push: jest.fn()
  }))
}))

describe('RouteStrategy tests', () => {
  it('Handle pluginRoute', () => {
    routeStrategy({
      id: 'plugin-test-3',
      label: 'IFrame',
      icon: 'clipboard',
      order: 1,
      integrationMode: 'iframe',
      pluginRoute: '/iframeTest',
      pluginUrl: 'https://www.google.com/webhp?igu=1'
    }).handlePluginLoad()
    expect(history.push).toHaveBeenCalledWith('/iframeTest')
  })

  it('Handle invalid plugin', () => {
    routeStrategy({id: '', label: '', integrationMode: 'iframe'}).handlePluginLoad()
    expect(history.push).toHaveBeenCalledWith('')
  })
})
