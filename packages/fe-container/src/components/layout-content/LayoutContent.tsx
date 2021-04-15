/*
 * Copyright 2021 Mia srl
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React, {useCallback, useContext, useEffect, useState} from 'react'
import {Layout} from 'antd'
import {Plugin} from '@mia-platform/core'

import {ConfigurationContext} from '@contexts/Configuration.context'
import {findCurrentPlugin, history} from '@utils/plugins/PluginsLoaderFacade'
import {INTEGRATION_METHODS} from '@constants'

import './LayoutContent.less'
import classNames from 'classnames'

// import {ErrorPage401} from '@components/error-page-401/ErrorPage401'
// import {ErrorPage404} from '@components/error-page-404/ErrorPage404'
// import {ErrorPage500} from '@components/error-page-500/ErrorPage500'

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
      {/* <ErrorPage500 /> */}
      {/* <ErrorPage404 /> */}
      {/* <ErrorPage401 /> */}
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
