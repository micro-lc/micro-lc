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
import React, {useContext, useEffect, useState} from 'react'
import {Layout} from 'antd'
import {Configuration, Plugin} from '@mia-platform/core'
import {Route, Router, Switch} from 'react-router-dom'
import PropTypes from 'prop-types'

import {findCurrentPlugin, history} from '@utils/plugins/PluginsLoaderFacade'
import {ConfigurationContext} from '@contexts/Configuration.context'
import {ERROR_PATH, MICROLC_QIANKUN_CONTAINER} from '@constants'
import {ErrorPage500} from '@components/error-page-500/ErrorPage500'
import {ErrorPage401} from '@components/error-page-401/ErrorPage401'
import {ErrorPage404} from '@components/error-page-404/ErrorPage404'

import './LayoutContent.less'

export const LayoutContent: React.FC = () => {
  return (
    <Layout>
      <LayoutCenter/>
    </Layout>
  )
}

// @ts-ignore
const findPluginRoutes: (configuration: Configuration) => string[] = (configuration: Configuration) => {
  return (configuration.plugins || [])
    .filter(plugin => plugin.pluginRoute !== undefined)
    .map(plugin => plugin.pluginRoute)
}

const LayoutCenter: React.FC = () => {
  const [currentPlugin, setCurrentPlugin] = useState<Plugin | undefined>(findCurrentPlugin())
  const pluginsRoute = findPluginRoutes(useContext(ConfigurationContext))
  useEffect(() => {
    return history.listen(() => setCurrentPlugin(findCurrentPlugin()))
  })

  return (
    <Layout.Content data-testid='layout-content'>
      <Router history={history}>
        <Switch>
          <Route path={pluginsRoute}>
            <div className='layoutContent_plugin_container'>
              <PluginIframe plugin={currentPlugin}/>
              <div className='layoutContent_plugin' id={MICROLC_QIANKUN_CONTAINER}/>
            </div>
          </Route>
          <Route component={ErrorPage500} path={ERROR_PATH.INTERNAL_ERROR}/>
          <Route component={ErrorPage401} path={ERROR_PATH.UNAUTHORIZED}/>
          <Route component={ErrorPage404} path={ERROR_PATH.PAGE_NOT_FOUND}/>
        </Switch>
      </Router>
    </Layout.Content>
  )
}

type PluginIframeProps = {
  plugin: Plugin | undefined
}

const PluginIframe: React.FC<PluginIframeProps> = ({plugin}) => {
  return (
    <>
      {
        plugin &&
        <iframe className='layoutContent_iframe' frameBorder='0' src={plugin.pluginUrl} title={plugin.id}/>
      }
    </>
  )
}

PluginIframe.propTypes = {
  plugin: PropTypes.any
}
