import {HrefConfig} from './SideMenu'

export interface PluginStrategy {
  handlePluginLoad: () => void
}

interface StrategyParam {
  pluginStrategy: string,
  hrefConfig: {
    sameWindow: boolean,
    url: string
  }
}

export const retrievePluginLoadingStrategy = (menuEntry: StrategyParam) => {
  switch (menuEntry.pluginStrategy) {
    case 'href':
    default:
      return hrefStrategy(menuEntry.hrefConfig)
  }
}

function hrefStrategy (hrefConfig?: HrefConfig | null): PluginStrategy {
  return {
    handlePluginLoad: () => {
      if (hrefConfig?.sameWindow) {
        window.location.href = hrefConfig.url
      } else if (hrefConfig?.url) {
        window.open(hrefConfig.url)
      }
    }
  }
}
