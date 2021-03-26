import {Configuration, Plugin} from '@mia-platform/core'
import {useEffect, useState} from 'react'
import {retrieveConfiguration} from '../services/microlc/microlc.service'
import {finish, registerPlugin, retrievePluginStrategy, isCurrentPluginLoaded} from '../plugins/PluginsLoaderFacade'

export interface AppState {
  isLoading: boolean,
  configuration: Configuration
}

const pluginsSorter = (pluginA: Plugin, pluginB: Plugin) => (pluginA.order || 0) - (pluginB.order || 0)

const notHref = (plugin: Plugin) => ['qiankun', 'iframe'].includes(plugin.integrationMode)

const registerPlugins = (configuration: Configuration) => {
  configuration.plugins?.forEach(registerPlugin)
  finish()
}

const navigateToFirstPlugin = (configuration: Configuration) => {
  const firstValidPlugin: Plugin | undefined = configuration.plugins?.find(notHref)
  if (firstValidPlugin && !isCurrentPluginLoaded()) {
    retrievePluginStrategy(firstValidPlugin).handlePluginLoad()
  }
}

export const useConfiguration = () => {
  const [appState, setAppState] = useState<AppState>({isLoading: true, configuration: {}})

  useEffect(() => {
    const configurationSubscription = retrieveConfiguration()
      .subscribe((configuration: Configuration) => {
        document.title = configuration?.theming?.header?.pageTitle || document.title
        configuration.plugins = configuration.plugins?.sort(pluginsSorter)
        registerPlugins(configuration)
        setAppState({isLoading: false, configuration})
        navigateToFirstPlugin(configuration)
      })
    return () => configurationSubscription.unsubscribe()
  }, [])

  return appState
}
