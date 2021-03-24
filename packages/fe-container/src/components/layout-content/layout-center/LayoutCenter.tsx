import PropTypes from 'prop-types'
import React, {useCallback, useContext} from 'react'
import {ConfigurationContext} from '../../../contexts/Configuration.context'
import {Plugin} from '@mia-platform/core'
import {Route, Router, Switch} from 'react-router-dom'
import {Layout} from 'antd'
import {history} from '../../../plugins/PluginsLoaderFacade'

const layoutCenterProps = {
  closeSideMenu: PropTypes.func.isRequired
}

type LayoutCenterProps = PropTypes.InferProps<typeof layoutCenterProps>

export const LayoutCenter: React.FC<LayoutCenterProps> = ({closeSideMenu}) => {
  const configuration = useContext(ConfigurationContext)
  const hasRoute = useCallback((plugin: Plugin) => plugin.pluginRoute, [])
  const routerMapper = useCallback((plugin: Plugin) => (
    <Route key={plugin.id} path={plugin.pluginRoute}>
      <CenterPluginManager {...plugin}/>
    </Route>
  ), [])

  return (
    <Layout.Content data-testid="layout-content-overlay" onClick={closeSideMenu}>
      <Router history={history}>
        <Switch>
          {configuration.plugins?.filter(hasRoute).map(routerMapper)}
        </Switch>
      </Router>
    </Layout.Content>
  )
}

LayoutCenter.propTypes = layoutCenterProps

const CenterPluginManager: React.FC<Plugin> = (plugin) => {
  return (
    <>
      {plugin.integrationMode === 'iframe' &&
      <iframe className="layout-iframe" src={plugin.pluginUrl} title={plugin.id}/>}
      {plugin.integrationMode === 'qiankun' && <div id={plugin.id}/>}
    </>
  )
}
