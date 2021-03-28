import React from 'react'

import './App.less'
import {Launcher} from './containers/launcher/Launcher'
import {useConfiguration} from './hooks/useConfiguration'

const App: React.FC = () => {
  const appState = useConfiguration()

  return <Launcher {...appState}/>
}

export default App
