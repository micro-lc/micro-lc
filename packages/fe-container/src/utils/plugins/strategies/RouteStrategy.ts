import {Plugin} from '@mia-platform/core'
import {history, PluginStrategy, retrieveBasePath} from '@utils/plugins/PluginsLoaderFacade'

export function routeStrategy (plugin: Plugin): PluginStrategy {
  return {
    handlePluginLoad: () => {
      const basePath = retrieveBasePath()
      const pluginRoute = `${basePath}${plugin?.pluginRoute || ''}`.replace('//', '/')
      history.push(pluginRoute)
    }
  }
}
