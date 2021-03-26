import React, {useCallback, useContext} from 'react'
import {Layout} from 'antd'
import {Plugin} from '@mia-platform/core'
import {Route, Router, Switch} from 'react-router-dom'
import {ConfigurationContext} from '../../contexts/Configuration.context'
import {history} from '../../plugins/PluginsLoaderFacade'

import './LayoutContent.less'

export const LayoutContent: React.FC = () => {
  return (
    <Layout>
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
    <Layout.Content data-testid="layout-content">
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
      <iframe className="layout-iframe" frameBorder="0" src={plugin.pluginUrl} title={plugin.id}/>}
      {plugin.integrationMode === 'qiankun' && <div className="layout-plugin" id={plugin.id}/>}
    </>
  )
}
