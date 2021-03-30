import {createBrowserHistory} from 'history'
import {registerMicroApps, RegistrableApp, start} from 'qiankun'
import {ExternalLink, Plugin, User} from '@mia-platform/core'

import {INTEGRATION_METHODS} from '@constants'

export interface PluginStrategy {
  handlePluginLoad: () => void
}

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

export const isCurrentPluginLoaded = () => {
  return registeredPlugins.findIndex(isPluginLoaded) !== -1
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
  const quiankunConfig = registeredPlugins
    .filter(plugin => plugin.integrationMode === INTEGRATION_METHODS.QIANKUN)
    .map<RegistrableApp<any>>(plugin => ({
      name: plugin.id,
      entry: plugin.pluginUrl || '',
      container: `#${plugin.id}`,
      activeRule: plugin.pluginRoute || '',
      props: {
        currentUser: user
      }
    }))
  registerMicroApps(quiankunConfig)
  start()
}

export const history = createBrowserHistory({basename: process.env.PUBLIC_URL})

function hrefStrategy (externalLink?: ExternalLink): PluginStrategy {
  return {
    handlePluginLoad: () => {
      if (externalLink?.sameWindow) {
        window.location.href = externalLink.url
      } else if (externalLink?.url) {
        window.open(externalLink.url)
      }
    }
  }
}

function routeStrategy (plugin: Plugin): PluginStrategy {
  return {
    handlePluginLoad: () => {
      history.push(plugin?.pluginRoute || '')
    }
  }
}

function noOpStrategy (): PluginStrategy {
  return {
    handlePluginLoad: () => {
    }
  }
}
