import {ExternalLink} from '@mia-platform/core'
import {PluginStrategy} from '@utils/plugins/PluginsLoaderFacade'

export function hrefStrategy (externalLink?: ExternalLink): PluginStrategy {
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
