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
import {useEffect, useState} from 'react'
import {Configuration, Plugin, User} from '@mia-platform/core'

import {retrieveAppData} from '@services/microlc/microlc.service'
import {finish, isCurrentPluginLoaded, registerPlugin, retrievePluginStrategy} from '@utils/plugins/PluginsLoaderFacade'
import {INTEGRATION_METHODS} from '@constants'
import {manageTheming} from '@utils/theme/ThemeManager'

export interface AppState {
  isLoading: boolean,
  configuration: Configuration,
  user: Partial<User>
}

const pluginsSorter = (pluginA: Plugin, pluginB: Plugin) => (pluginA.order || 0) - (pluginB.order || 0)

const notHref = (plugin: Plugin) => plugin.integrationMode !== INTEGRATION_METHODS.HREF

const registerPlugins = (configuration: Configuration, user: Partial<User>) => {
  configuration.plugins?.forEach(registerPlugin)
  finish(user)
}

const navigateToFirstPlugin = (configuration: Configuration) => {
  const firstValidPlugin: Plugin | undefined = configuration.plugins?.find(notHref)
  if (firstValidPlugin && !isCurrentPluginLoaded()) {
    const pluginStrategy = retrievePluginStrategy(firstValidPlugin)
    pluginStrategy && pluginStrategy.handlePluginLoad()
  }
}

export const useAppData = () => {
  const [appState, setAppState] = useState<AppState>({isLoading: true, configuration: {}, user: {}})

  useEffect(() => {
    const configurationSubscription = retrieveAppData()
      .subscribe(({configuration, user}) => {
        manageTheming(configuration)
        configuration.plugins = configuration.plugins?.sort(pluginsSorter)
        registerPlugins(configuration, user)
        setAppState({isLoading: false, configuration, user})
        navigateToFirstPlugin(configuration)
      }, (err) => setAppState(() => {
        throw err
      }))
    return () => configurationSubscription.unsubscribe()
  }, [])

  return appState
}
