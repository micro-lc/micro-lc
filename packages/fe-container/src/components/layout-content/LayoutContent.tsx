import React, {useCallback, useContext, useEffect, useState} from 'react'
import {Layout} from 'antd'
import {Plugin} from '@mia-platform/core'

import {ConfigurationContext} from '@contexts/Configuration.context'
import {findCurrentPlugin, history} from '@utils/plugins/PluginsLoaderFacade'
import {INTEGRATION_METHODS} from '@constants'

import './LayoutContent.less'
import classNames from 'classnames'

export const LayoutContent: React.FC = () => {
  return (
    <Layout>
      <LayoutCenter/>
    </Layout>
  )
}

const LayoutCenter: React.FC = () => {
  const [currentPlugin, setCurrentPlugin] = useState<Plugin | undefined>(findCurrentPlugin())
  const configuration = useContext(ConfigurationContext)
  const hasRoute = useCallback((plugin: Plugin) => plugin.pluginRoute, [])
  const routerMapper = useCallback((plugin: Plugin) => {
    const classes = classNames('layoutContent_plugin_container', {hide: plugin !== currentPlugin})
    return (
      <div className={classes} key={plugin.id}>
        <CenterPluginManager {...plugin}/>
      </div>
    )
  }, [currentPlugin])

  useEffect(() => {
    return history.listen(() => setCurrentPlugin(findCurrentPlugin()))
  })

  return (
    <Layout.Content data-testid="layout-content">
      {configuration.plugins?.filter(hasRoute).map(routerMapper)}
    </Layout.Content>
  )
}

const CenterPluginManager: React.FC<Plugin> = (plugin) => {
  const components = {
    [INTEGRATION_METHODS.IFRAME]: <PluginIframe {...plugin}/>,
    [INTEGRATION_METHODS.QIANKUN]: <div className='layoutContent_plugin' id={plugin.id}/>
  }
  return (<>{components[plugin.integrationMode]}</>)
}

const PluginIframe: React.FC<Plugin> = (plugin) => {
  return (
    <iframe className='layoutContent_iframe' frameBorder='0' src={plugin.pluginUrl} title={plugin.id}/>
  )
}
