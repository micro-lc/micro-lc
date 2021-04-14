import {finish, history, registerPlugin, retrievePluginStrategy} from './PluginsLoaderFacade'
import {registerMicroApps, start} from 'qiankun'

history.push = jest.fn()
jest.mock('qiankun', () => ({
  start: jest.fn(),
  registerMicroApps: jest.fn()
}))

describe('Test plugin loading', () => {
  it('test href same window', () => {
    // eslint-disable-next-line
    window = Object.create(window)
    Object.defineProperty(window, 'location', {
      value: {
        href: '',
        pathname: ''
      },
      writable: true
    })
    const integrationMode: 'href' = 'href'
    const pluginToRegister = {
      id: 'plugin-1',
      label: 'Plugin 1',
      integrationMode,
      externalLink: {
        sameWindow: true,
        url: 'https://google.it'
      }
    }
    registerPlugin(pluginToRegister)
    retrievePluginStrategy(pluginToRegister).handlePluginLoad()
    expect(window.location.href).toBe('https://google.it')
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
        url: 'https://google.it'
      }
    }
    registerPlugin(pluginToRegister)
    retrievePluginStrategy(pluginToRegister).handlePluginLoad()
    expect(window.open).toBeCalledWith('https://google.it')
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
        url: 'https://google.it'
      }
    }
    registerPlugin(pluginToRegister)
    retrievePluginStrategy(pluginToRegister).handlePluginLoad()
    expect(window.open).not.toHaveBeenCalled()
  })

  it('invalid plugin url configuration: do nothing', () => {
    const integrationMode: 'href' = 'href'
    // @ts-ignore
    const externalLink = undefined
    window.open = jest.fn()
    const pluginToRegister = {
      id: 'plugin-1',
      label: 'Plugin 1',
      integrationMode,
      externalLink
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
    finish({})
    expect(start).toHaveBeenCalled()
    expect(registerMicroApps).toHaveBeenCalledWith([])
  })

  it('test qiankun', () => {
    const integrationMode: 'qiankun' = 'qiankun'
    window.open = jest.fn()
    const pluginToRegister = {
      id: 'plugin-1',
      label: 'Plugin 1',
      integrationMode,
      pluginRoute: '/qiankunTest',
      pluginUrl: 'https://www.google.com/webhp?igu=1'
    }
    registerPlugin(pluginToRegister)
    retrievePluginStrategy(pluginToRegister).handlePluginLoad()
    expect(history.push).toHaveBeenCalledWith('/qiankunTest')
    finish({})
    expect(start).toHaveBeenCalled()
    expect(registerMicroApps).toHaveBeenCalledWith([{
      name: 'plugin-1',
      entry: 'https://www.google.com/webhp?igu=1',
      container: '#plugin-1',
      activeRule: '/qiankunTest',
      props: {
        basePath: '',
        currentUser: {}
      }
    }])
  })

  it('test undefined plugin route: empty fallback', () => {
    // @ts-ignore
    const pluginRoute: string = undefined
    const integrationMode: 'qiankun' = 'qiankun'
    window.open = jest.fn()
    const pluginToRegister = {
      id: 'plugin-1',
      label: 'Plugin 1',
      integrationMode,
      pluginRoute,
      pluginUrl: pluginRoute
    }
    registerPlugin(pluginToRegister)
    retrievePluginStrategy(pluginToRegister).handlePluginLoad()
    expect(history.push).toHaveBeenCalledWith('')
    finish({})
    expect(start).toHaveBeenCalled()
    expect(registerMicroApps).toHaveBeenCalled()
  })
})
