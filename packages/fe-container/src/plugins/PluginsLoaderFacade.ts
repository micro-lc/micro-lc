import {ExternalLink, Plugin} from '@mia-platform/core'
import {createBrowserHistory} from 'history'
import {registerMicroApps, RegistrableApp, start} from 'qiankun'

export interface PluginStrategy {
  handlePluginLoad: () => void
}

const registeredPlugins: Map<string, PluginStrategy> = new Map<string, PluginStrategy>()
const qiankunPlugins: Plugin[] = []
const routerStrategyModes = ['qiankun', 'iframe']

export const registerPlugin = (plugin: Plugin) => {
  if (plugin.integrationMode === 'qiankun') {
    qiankunPlugins.push(plugin)
  }
  const pluginStrategy = routerStrategyModes.includes(plugin.integrationMode) ? routeStrategy(plugin) : hrefStrategy(plugin.externalLink)
  registeredPlugins.set(plugin.id, pluginStrategy)
}

export const retrievePluginStrategy = (plugin: Plugin) => {
  return registeredPlugins.get(plugin.id) || hrefStrategy(plugin.externalLink)
}

export const finish = () => {
  const quiankunConfig = qiankunPlugins.map<RegistrableApp<any>>(plugin => ({
    name: plugin.label,
    entry: plugin.pluginUrl || '',
    container: `#${plugin.id}`,
    activeRule: plugin.pluginUrl || ''
  }))
  registerMicroApps(quiankunConfig)
  start()
}

export const history = createBrowserHistory({basename: process.env.PUBLIC_URL})

function hrefStrategy (externalLink?: ExternalLink): PluginStrategy {
  return {
    handlePluginLoad: () => {
      if (externalLink?.sameWindow) {
        window.location.href = externalLink?.url || ''
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
