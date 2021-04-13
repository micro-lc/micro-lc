import {Plugin} from '@mia-platform/core'
import {history, PluginStrategy} from '@utils/plugins/PluginsLoaderFacade'

export function routeStrategy (plugin: Plugin): PluginStrategy {
  const pluginRoute = `${window.location.pathname || ''}${plugin?.pluginRoute || ''}`.replace('//', '/')
  return {
    handlePluginLoad: () => {
      history.push(pluginRoute)
    }
  }
}
