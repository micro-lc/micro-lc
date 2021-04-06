import {PluginStrategy} from '@utils/plugins/PluginsLoaderFacade'

export function noOpStrategy (): PluginStrategy {
  return {
    handlePluginLoad: () => {
    }
  }
}
