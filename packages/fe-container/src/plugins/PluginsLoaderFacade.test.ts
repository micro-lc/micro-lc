import {history, registerPlugin, retrievePluginStrategy} from './PluginsLoaderFacade'

history.push = jest.fn()

describe('Test plugin loading', () => {
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
    // @ts-ignore
    const integrationMode: 'qiankun' = 'invalidMode'
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

  it('test iframe', () => {
    const integrationMode: 'iframe' = 'iframe'
    window.open = jest.fn()
    const pluginToRegister = {
      id: 'plugin-1',
      label: 'Plugin 1',
      integrationMode,
      pluginRoute: '/iframeTest',
      pluginUrl: 'https://www.google.com/webhp?igu=1'
    }
    registerPlugin(pluginToRegister)
    retrievePluginStrategy(pluginToRegister).handlePluginLoad()
    expect(history.push).toHaveBeenCalledWith('/iframeTest')
  })

  it('test qiankun', () => {
    const integrationMode: 'qiankun' = 'qiankun'
    window.open = jest.fn()
    const pluginToRegister = {
      id: 'plugin-1',
      label: 'Plugin 1',
      integrationMode,
      pluginRoute: '/iframeTest',
      pluginUrl: 'https://www.google.com/webhp?igu=1'
    }
    registerPlugin(pluginToRegister)
    retrievePluginStrategy(pluginToRegister).handlePluginLoad()
    expect(history.push).toHaveBeenCalledWith('/iframeTest')
  })
})
