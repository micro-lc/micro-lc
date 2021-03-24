import React, {useEffect, useState} from 'react'
import {Configuration} from '@mia-platform/core'

import './App.less'
import {retrieveConfiguration} from './services/microlc/microlc.service'
import {Launcher} from './containers/launcher/Launcher'
import {registerPlugin, finish} from './plugins/PluginsLoaderFacade'

interface AppState {
  isLoading: boolean,
  configuration: Configuration
}

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({isLoading: true, configuration: {}})

  useEffect(() => {
    const configurationSubscription = retrieveConfiguration()
      .subscribe((configuration: Configuration) => {
        configuration.plugins?.forEach(registerPlugin)
        finish()
        setAppState({isLoading: false, configuration})
      })
    return () => configurationSubscription.unsubscribe()
  }, [])

  return <Launcher {...appState}/>
}

export default App
