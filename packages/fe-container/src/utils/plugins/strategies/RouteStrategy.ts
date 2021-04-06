import {Plugin} from '@mia-platform/core'
import {history, PluginStrategy} from '@utils/plugins/PluginsLoaderFacade'

export function routeStrategy (plugin: Plugin): PluginStrategy {
  return {
    handlePluginLoad: () => {
      history.push(plugin?.pluginRoute || '')
    }
  }
}
