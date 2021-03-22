import React, {useEffect, useState} from 'react'
import {Configuration} from '@mia-platform/core'

import './App.less'
import {retrieveConfiguration} from './services/microlc/microlc.service'
import {Launcher} from './containers/launcher/Launcher'

interface AppState {
  isLoading: boolean,
  configuration: Configuration
}

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({isLoading: true, configuration: {}})

  useEffect(() => {
    const configurationSubscription = retrieveConfiguration()
      .subscribe((configuration) => {
        setAppState({isLoading: false, configuration})
      })
    return () => configurationSubscription.unsubscribe()
  }, [])

  return <Launcher configuration={appState.configuration} isLoading={appState.isLoading}/>
}

export default App
