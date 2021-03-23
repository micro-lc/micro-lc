import {ExternalLink, Plugin} from '@mia-platform/core'
import {createBrowserHistory} from 'history'

export interface PluginStrategy {
  handlePluginLoad: () => void
}

export const registerPlugin = (plugin: Plugin) => {
  let pluginStrategy: PluginStrategy
  switch (plugin.integrationMode) {
    case 'iframe':
      pluginStrategy = iframeStrategy(plugin)
      break
    case 'href':
    default:
      pluginStrategy = hrefStrategy(plugin.externalLink)
  }
  registeredPlugins.set(plugin.id, pluginStrategy)
}

export const retrievePluginStrategy = (plugin: Plugin) => {
  return registeredPlugins.get(plugin.id) || hrefStrategy(plugin.externalLink)
}

export const history = createBrowserHistory({basename: process.env.PUBLIC_URL})

const registeredPlugins: Map<string, PluginStrategy> = new Map<string, PluginStrategy>()

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

function iframeStrategy (plugin: Plugin): PluginStrategy {
  return {
    handlePluginLoad: () => {
      history.push(plugin?.pluginRoute || '')
    }
  }
}
