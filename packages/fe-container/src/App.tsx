import React, {useEffect, useState} from 'react'
import {Configuration} from '@mia-platform/core'

import './App.less'
import {LoadingStructure} from './components/loading-structure/LoadingStructure'
import {LoadedStructure} from './components/loaded-structure/LoadedStructure'
import {retrieveConfiguration} from './services/microlc/microlc.service'

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

  return (
    <>{appState.isLoading ?
      <LoadingStructure/> :
      <LoadedStructure configuration={appState.configuration}/>
    }</>
  )
}

export default App
