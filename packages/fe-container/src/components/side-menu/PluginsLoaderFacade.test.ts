import {retrievePluginLoadingStrategy} from './PluginsLoaderFacade'

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
    const pluginStrategy = retrievePluginLoadingStrategy({
      pluginStrategy: 'href',
      hrefConfig: {
        sameWindow: true,
        url: 'http://google.it'
      }
    })
    pluginStrategy.handlePluginLoad()
    expect(window.location.href).toBe('http://google.it')
  })

  it('test href new window', () => {
    window.open = jest.fn()
    const pluginStrategy = retrievePluginLoadingStrategy({
      pluginStrategy: 'href',
      hrefConfig: {
        sameWindow: false,
        url: 'http://google.it'
      }
    })
    pluginStrategy.handlePluginLoad()
    expect(window.open).toBeCalledWith('http://google.it')
  })

  it('test href fallback', () => {
    window.open = jest.fn()
    const pluginStrategy = retrievePluginLoadingStrategy({
      pluginStrategy: 'notKnownStrategy',
      hrefConfig: {
        sameWindow: false,
        url: 'http://google.it'
      }
    })
    pluginStrategy.handlePluginLoad()
    expect(window.open).toBeCalledWith('http://google.it')
  })

  it('invalid plugin url configuration: do nothing', () => {
    window.open = jest.fn()
    const pluginStrategy = retrievePluginLoadingStrategy({
      pluginStrategy: 'notKnownStrategy',
      hrefConfig: {
        sameWindow: false,
        url: ''
      }
    })
    pluginStrategy.handlePluginLoad()
    expect(window.open).not.toBeCalled()
  })
})
