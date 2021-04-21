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
import {createBrowserHistory} from 'history'
import {addErrorHandler, registerMicroApps, RegistrableApp, start} from 'qiankun'
import {Plugin, User} from '@mia-platform/core'

import {ERROR_PATH, INTEGRATION_METHODS, MICROLC_QIANKUN_CONTAINER} from '@constants'
import {noOpStrategy} from '@utils/plugins/strategies/NoOpStrategy'
import {hrefStrategy} from '@utils/plugins/strategies/HrefStrategy'
import {routeStrategy} from '@utils/plugins/strategies/RouteStrategy'
import {PluginStrategy} from '@utils/plugins/strategies/PluginStrategy'

const registeredPluginsStrategies = new Map<string, PluginStrategy>()
const registeredPlugins: Plugin[] = []

export const registerPlugin = (plugin: Plugin) => {
  const pluginStrategy: PluginStrategy = strategyBuilder(plugin)
  registeredPlugins.push(plugin)
  registeredPluginsStrategies.set(plugin.id, pluginStrategy)
}

export const retrievePluginStrategy = (plugin: Plugin) => {
  return registeredPluginsStrategies.get(plugin.id) || noOpStrategy()
}

export const isPluginLoaded = (plugin: Plugin) =>
  plugin.pluginRoute ? window.location.pathname.endsWith(plugin.pluginRoute) : false

export const findCurrentPlugin = () => {
  return registeredPlugins.find(isPluginLoaded)
}

export const isCurrentPluginLoaded = () => {
  const isErrorPage = window.location.pathname.endsWith(ERROR_PATH.INTERNAL_ERROR) || window.location.pathname.endsWith(ERROR_PATH.UNAUTHORIZED)
  return isErrorPage || findCurrentPlugin() !== undefined
}

const strategyBuilder = (plugin: Plugin) => {
  switch (plugin.integrationMode) {
    case INTEGRATION_METHODS.HREF:
      return hrefStrategy(plugin.externalLink)
    case INTEGRATION_METHODS.QIANKUN:
    case INTEGRATION_METHODS.IFRAME:
      return routeStrategy(plugin)
    default:
      return noOpStrategy()
  }
}

export const finish = (user: Partial<User>) => {
  const basePath = retrieveBasePath()
  history = createBrowserHistory({basename: basePath})
  const quiankunConfig = registeredPlugins
    .filter(plugin => plugin.integrationMode === INTEGRATION_METHODS.QIANKUN)
    .map<RegistrableApp<any>>(plugin => ({
      name: plugin.id,
      entry: plugin.pluginUrl || '',
      container: `#${MICROLC_QIANKUN_CONTAINER}`,
      activeRule: `${basePath}${plugin.pluginRoute || ''}`,
      props: {
        basePath,
        currentUser: user
      }
    }))
  registerMicroApps(quiankunConfig)
  addErrorHandler(_ => history.push(ERROR_PATH.INTERNAL_ERROR))
  start()
}

const DOUBLE_SLASH = /\/\//g

const retrieveBasePath = () => {
  let basePath = `${window.location.pathname || ''}`
  const currentPlugin = findCurrentPlugin()
  if (currentPlugin?.pluginRoute) {
    basePath = window.location.pathname.replace(currentPlugin.pluginRoute, '')
  }
  basePath = basePath.replace(new RegExp(ERROR_PATH.INTERNAL_ERROR, 'g'), '')
    .replace(new RegExp(ERROR_PATH.UNAUTHORIZED, 'g'), '')
    .replace(DOUBLE_SLASH, '/')
  return basePath.endsWith('/') ? basePath.slice(0, -1) : basePath
}

export let history = createBrowserHistory({basename: window.location.pathname})
