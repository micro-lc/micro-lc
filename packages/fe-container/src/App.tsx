import React, {useCallback, useEffect, useState} from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import {Configuration, Plugin} from '@mia-platform/core'

import './App.less'
import {retrieveConfiguration} from './services/microlc/microlc.service'
import {Launcher} from './containers/launcher/Launcher'
import {registerPlugin} from './plugins/PluginsLoaderFacade'

interface AppState {
  isLoading: boolean,
  configuration: Configuration
}

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({isLoading: true, configuration: {}})

  const routerFilter = useCallback((plugin: Plugin) => plugin.pluginRoute, [])
  const routerMapper = useCallback((plugin: Plugin) => {
    return <Route path={plugin.pluginRoute}/>
  }, [])

  useEffect(() => {
    const configurationSubscription = retrieveConfiguration()
      .subscribe((configuration: Configuration) => {
        configuration.plugins?.forEach(registerPlugin)
        setAppState({isLoading: false, configuration})
      })
    return () => configurationSubscription.unsubscribe()
  }, [])

  return (
    <>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Switch>
          {
            appState.configuration.plugins
              ?.filter(routerFilter)
              .map(routerMapper)
          }
        </Switch>
      </BrowserRouter>
      <Launcher {...appState}/>
    </>
  )
}

export default App
