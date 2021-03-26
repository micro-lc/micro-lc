import React from 'react'

import {Launcher} from './containers/launcher/Launcher'
import {useConfiguration} from './hooks/useConfiguration'

import './App.less'

const App: React.FC = () => {
  const appState = useConfiguration()

  return <Launcher {...appState}/>
}

export default App
