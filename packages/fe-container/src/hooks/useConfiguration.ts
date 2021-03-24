import {Configuration} from '@mia-platform/core'
import {useEffect, useState} from 'react'
import {retrieveConfiguration} from '../services/microlc/microlc.service'
import {finish, registerPlugin} from '../plugins/PluginsLoaderFacade'

export interface AppState {
  isLoading: boolean,
  configuration: Configuration
}

export const useConfiguration = () => {
  const [appState, setAppState] = useState<AppState>({isLoading: true, configuration: {}})

  useEffect(() => {
    const configurationSubscription = retrieveConfiguration()
      .subscribe((configuration: Configuration) => {
        document.title = configuration?.theming?.header?.pageTitle || document.title
        configuration.plugins?.forEach(registerPlugin)
        finish()
        setAppState({isLoading: false, configuration})
      })
    return () => configurationSubscription.unsubscribe()
  }, [])

  return appState
}
