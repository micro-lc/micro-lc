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
import {addErrorHandler, registerMicroApps, start} from 'qiankun'
import {Plugin} from '@mia-platform/core'

import {RESERVED_PATH} from '@constants'

import {finish, isCurrentPluginLoaded, registeredPlugins, registerPlugin, retrievePluginStrategy} from './PluginsLoaderFacade'

jest.mock('qiankun', () => ({
  start: jest.fn(),
  registerMicroApps: jest.fn(),
  addErrorHandler: jest.fn()
}))

describe('Test plugin loading', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    registeredPlugins.splice(0, registeredPlugins.length)
  })

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
    finish({})
    expect(start).toHaveBeenCalled()
    expect(addErrorHandler).toHaveBeenCalled()
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
    finish({})
    expect(start).toHaveBeenCalled()
    expect(addErrorHandler).toHaveBeenCalled()
    expect(registerMicroApps).toHaveBeenCalledWith([{
      name: 'plugin-1',
      entry: 'https://www.google.com/webhp?igu=1',
      container: '#microlc-qiankun-contaier',
      activeRule: '/qiankunTest',
      props: {
        basePath: '',
        activeRule: '/qiankunTest',
        currentUser: {}
      }
    }])
  })

  it('test qiankun with shared props', () => {
    const integrationMode: 'qiankun' = 'qiankun'
    window.open = jest.fn()
    const pluginToRegister = {
      id: 'plugin-1',
      label: 'Plugin 1',
      integrationMode,
      pluginRoute: '/qiankunTest',
      pluginUrl: 'https://www.google.com/webhp?igu=1'
    }
    expect(registeredPlugins).toHaveLength(0)
    registerPlugin(pluginToRegister)
    retrievePluginStrategy(pluginToRegister).handlePluginLoad()
    finish({email: 'email'}, {props: {headers: 'any'}})
    expect(start).toHaveBeenCalled()
    expect(addErrorHandler).toHaveBeenCalled()
    expect(registerMicroApps).toHaveBeenCalledTimes(1)
    expect(registerMicroApps).toHaveBeenCalledWith([{
      name: 'plugin-1',
      entry: 'https://www.google.com/webhp?igu=1',
      container: '#microlc-qiankun-contaier',
      activeRule: '/qiankunTest',
      props: {
        basePath: '',
        activeRule: '/qiankunTest',
        currentUser: {email: 'email'},
        headers: 'any'
      }
    }])
    expect(registeredPlugins).toHaveLength(1)
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
    finish({})
    expect(start).toHaveBeenCalled()
    expect(addErrorHandler).toHaveBeenCalled()
    expect(registerMicroApps).toHaveBeenCalled()
  })

  it('isCurrentPluginLoaded true for reserved path', () => {
    window.location.pathname = RESERVED_PATH.LOADING
    expect(isCurrentPluginLoaded()).toBeTruthy()
    window.location.pathname = RESERVED_PATH.UNAUTHORIZED
    expect(isCurrentPluginLoaded()).toBeTruthy()
    window.location.pathname = RESERVED_PATH.PAGE_NOT_FOUND
    expect(isCurrentPluginLoaded()).toBeFalsy()
    window.location.pathname = RESERVED_PATH.INTERNAL_ERROR
    expect(isCurrentPluginLoaded()).toBeTruthy()
    expect(RESERVED_PATH.getMicrolcPaths())
      .toMatchObject([RESERVED_PATH.INTERNAL_ERROR, RESERVED_PATH.UNAUTHORIZED, RESERVED_PATH.LOADING])
  })

  it('test content register', () => {
    const integrationMode: 'qiankun' = 'qiankun'
    window.open = jest.fn()

    const pluginToRegister: Plugin = {
      id: 'plugin-1',
      label: 'Plugin 1',
      integrationMode,
      pluginRoute: '/qiankunTest',
      pluginUrl: 'https://www.google.com/webhp?igu=1',
      // @ts-ignore
      content: [{
        id: 'plugin-2',
        label: 'Plugin 2',
        integrationMode,
        pluginRoute: '/qiankunTest1',
        pluginUrl: 'https://www.google.com/webhp?igu=1'
      }]
    }
    registerPlugin(pluginToRegister)
    retrievePluginStrategy(pluginToRegister).handlePluginLoad()
    finish({})
    expect(start).toHaveBeenCalled()
    expect(addErrorHandler).toHaveBeenCalled()
    expect(registerMicroApps.mock.calls[0][0]).toContainEqual({
      name: 'plugin-2',
      entry: 'https://www.google.com/webhp?igu=1',
      container: '#microlc-qiankun-contaier',
      activeRule: '/qiankunTest1',
      props: {
        basePath: '',
        activeRule: '/qiankunTest1',
        currentUser: {}
      }
    })
    expect(registerMicroApps.mock.calls[0][0]).toContainEqual({
      name: 'plugin-1',
      entry: 'https://www.google.com/webhp?igu=1',
      container: '#microlc-qiankun-contaier',
      activeRule: '/qiankunTest',
      props: {
        basePath: '',
        activeRule: '/qiankunTest',
        currentUser: {}
      }
    })
  })
})
