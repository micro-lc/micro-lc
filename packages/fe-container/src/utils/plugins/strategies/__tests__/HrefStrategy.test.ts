import {hrefStrategy} from '@utils/plugins/strategies/HrefStrategy'

describe('Href strategy tests', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: {
        href: '',
        writable: true
      }
    })
    window.location.href = ''
  })

  it('Same window change location', () => {
    const sameWindowLink = {
      url: 'https://google.it',
      sameWindow: true
    }
    hrefStrategy(sameWindowLink).handlePluginLoad()
    expect(window.location.href).toBe('https://google.it')
  })

  it('Open new window with the url', () => {
    const otherWindowLink = {
      url: 'https://google.it',
      sameWindow: false
    }
    window.open = jest.fn()
    hrefStrategy(otherWindowLink).handlePluginLoad()
    expect(window.open).toHaveBeenCalledWith('https://google.it')
  })

  it('Invalid configuration: nothing happen', () => {
    window.open = jest.fn()
    hrefStrategy().handlePluginLoad()
    expect(window.open).not.toHaveBeenCalled()
    expect(window.location.href).toBe('')
  })
})
