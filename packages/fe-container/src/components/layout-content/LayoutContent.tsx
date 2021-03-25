import React, {useCallback, useContext} from 'react'
import {Layout} from 'antd'
import {Plugin} from '@mia-platform/core'
import {Route, Router, Switch} from 'react-router-dom'

import {MenuOpenedContext} from '../../contexts/MenuOpened.context'
import {ConfigurationContext} from '../../contexts/Configuration.context'
import {history} from '../../plugins/PluginsLoaderFacade'

import './LayoutContent.less'

export const LayoutContent: React.FC = () => {
  const {isMenuOpened, setMenuOpened} = useContext(MenuOpenedContext)

  const closeSideMenu = useCallback(() => setMenuOpened(false), [setMenuOpened])

  return (
    <Layout className={isMenuOpened ? 'layout-container-overlay' : ''} onClick={closeSideMenu}>
      <LayoutCenter/>
    </Layout>
  )
}

const LayoutCenter: React.FC = () => {
  const configuration = useContext(ConfigurationContext)
  const hasRoute = useCallback((plugin: Plugin) => plugin.pluginRoute, [])
  const routerMapper = useCallback((plugin: Plugin) => (
    <Route key={plugin.id} path={plugin.pluginRoute}>
      <CenterPluginManager {...plugin}/>
    </Route>
  ), [])

  return (
    <Layout.Content data-testid="layout-content-overlay">
      <Router history={history}>
        <Switch>
          {configuration.plugins?.filter(hasRoute).map(routerMapper)}
        </Switch>
      </Router>
    </Layout.Content>
  )
}

const CenterPluginManager: React.FC<Plugin> = (plugin) => {
  return (
    <>
      {plugin.integrationMode === 'iframe' &&
      <iframe className="layout-iframe" src={plugin.pluginUrl} title={plugin.id}/>}
      {plugin.integrationMode === 'qiankun' && <div id={plugin.id}/>}
    </>
  )
}
