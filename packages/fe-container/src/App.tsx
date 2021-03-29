import React from 'react'

import {Launcher} from './containers/launcher/Launcher'
import {useAppData} from '@hooks/useAppData'

import './App.less'

const App: React.FC = () => {
  const appState = useAppData()

  return <Launcher {...appState}/>
}

export default App
