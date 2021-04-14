import {Plugin} from '@mia-platform/core'
import {basePath, history, PluginStrategy} from '@utils/plugins/PluginsLoaderFacade'

export function routeStrategy (plugin: Plugin): PluginStrategy {
  return {
    handlePluginLoad: () => {
      const pluginRoute = `${basePath}${plugin?.pluginRoute || ''}`.replace('//', '/')
      history.push(pluginRoute)
    }
  }
}
