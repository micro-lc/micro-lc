import {registerPlugin, retrievePluginStrategy} from './PluginsLoaderFacade'

describe('Test plugin loading', () => {
  const originalWindow = {...window}

  afterEach(() => {
    // eslint-disable-next-line
    window = originalWindow
  })

  it('test href same window', () => {
    // eslint-disable-next-line
    window = Object.create(window)
    Object.defineProperty(window, 'location', {
      value: {
        href: '',
        writable: true
      }
    })
    const integrationMode: 'href' = 'href'
    const pluginToRegister = {
      id: 'plugin-1',
      label: 'Plugin 1',
      integrationMode,
      externalLink: {
        sameWindow: true,
        url: 'http://google.it'
      }
    }
    registerPlugin(pluginToRegister)
    retrievePluginStrategy(pluginToRegister).handlePluginLoad()
    expect(window.location.href).toBe('http://google.it')
  })

  it('test href new window', () => {
    const integrationMode: 'href' = 'href'
    window.open = jest.fn()
    const pluginToRegister = {
      id: 'plugin-1',
      label: 'Plugin 1',
      integrationMode,
      externalLink: {
        sameWindow: false,
        url: 'http://google.it'
      }
    }
    registerPlugin(pluginToRegister)
    retrievePluginStrategy(pluginToRegister).handlePluginLoad()
    expect(window.open).toBeCalledWith('http://google.it')
  })

  it('test href fallback', () => {
    const integrationMode: 'iframe' = 'iframe'
    window.open = jest.fn()
    const pluginToRegister = {
      id: 'plugin-1',
      label: 'Plugin 1',
      integrationMode,
      externalLink: {
        sameWindow: false,
        url: 'http://google.it'
      }
    }
    registerPlugin(pluginToRegister)
    retrievePluginStrategy(pluginToRegister).handlePluginLoad()
    expect(window.open).toBeCalledWith('http://google.it')
  })

  it('invalid plugin url configuration: do nothing', () => {
    const integrationMode: 'href' = 'href'
    window.open = jest.fn()
    const pluginToRegister = {
      id: 'plugin-1',
      label: 'Plugin 1',
      integrationMode,
      externalLink: {
        sameWindow: false,
        url: ''
      }
    }
    registerPlugin(pluginToRegister)
    retrievePluginStrategy(pluginToRegister).handlePluginLoad()
    expect(window.open).not.toBeCalled()
  })
})
