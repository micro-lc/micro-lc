import React, {useCallback, useContext} from 'react'
import {Layout} from 'antd'
import {Route, Router, Switch} from 'react-router-dom'
import {Plugin} from '@mia-platform/core'

import './LayoutContent.less'
import {ConfigurationContext} from '../../contexts/Configuration.context'
import {history} from '../../plugins/PluginsLoaderFacade'
import {INTEGRATION_METHODS} from '../../constants'

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
      {
        plugin.integrationMode === INTEGRATION_METHODS.IFRAME && (
          <iframe
            className='layout-iframe'
            frameBorder='0'
            src={plugin.pluginUrl}
            title={plugin.id}
          />
        )
      }
      {
        plugin.integrationMode === INTEGRATION_METHODS.QIANKUN && <div className='layout-plugin' id={plugin.id}/>
      }
    </>
  )
}
