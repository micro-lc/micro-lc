import {useEffect, useState} from 'react'
import {Configuration, Plugin, User} from '@mia-platform/core'

import {retrieveAppData} from '@services/microlc/microlc.service'
import {finish, isCurrentPluginLoaded, registerPlugin, retrievePluginStrategy} from '@plugins-utils/PluginsLoaderFacade'
import {INTEGRATION_METHODS} from '@constants'

export interface AppState {
  isLoading: boolean,
  configuration: Configuration,
  user: Partial<User>
}

const pluginsSorter = (pluginA: Plugin, pluginB: Plugin) => (pluginA.order || 0) - (pluginB.order || 0)

const notHref = (plugin: Plugin) => plugin.integrationMode !== INTEGRATION_METHODS.HREF

const registerPlugins = (configuration: Configuration, user: Partial<User>) => {
  configuration.plugins?.forEach(registerPlugin)
  finish(user)
}

const navigateToFirstPlugin = (configuration: Configuration) => {
  const firstValidPlugin: Plugin | undefined = configuration.plugins?.find(notHref)
  if (firstValidPlugin && !isCurrentPluginLoaded()) {
    retrievePluginStrategy(firstValidPlugin).handlePluginLoad()
  }
}

export const useAppData = () => {
  const [appState, setAppState] = useState<AppState>({isLoading: true, configuration: {}, user: {}})

  useEffect(() => {
    const configurationSubscription = retrieveAppData()
      .subscribe(({configuration, user}) => {
        document.title = configuration.theming?.header?.pageTitle || document.title
        configuration.plugins = configuration.plugins?.sort(pluginsSorter)
        registerPlugins(configuration, user)
        setAppState({isLoading: false, configuration, user})
        navigateToFirstPlugin(configuration)
      })
    return () => configurationSubscription.unsubscribe()
  }, [])

  return appState
}
