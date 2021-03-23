import {ExternalLink, Plugin} from '@mia-platform/core'

export interface PluginStrategy {
  handlePluginLoad: () => void
}

export const registerPlugin = (plugin: Plugin) => {
  switch (plugin.integrationMode) {
    case 'href':
    default:
      registeredPlugins.set(plugin.id, hrefStrategy(plugin.externalLink))
  }
}

export const retrievePluginStrategy = (plugin: Plugin) => {
  return registeredPlugins.get(plugin.id) || hrefStrategy(plugin.externalLink)
}

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
