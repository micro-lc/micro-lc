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
import {Plugin} from '@mia-platform/core'
import classNames from 'classnames'

import {ConfigurationContext} from '@contexts/Configuration.context'
import {PluginStrategy} from '@utils/plugins/strategies/PluginStrategy'
import {history, isPluginLoaded, retrievePluginStrategy} from '@utils/plugins/PluginsLoaderFacade'
import {MENU_LOCATION} from '@constants'

import './TopBarMenu.less'

export const TopBarMenu: React.FC = () => {
  const configuration = useContext(ConfigurationContext)
  const hasPlugins = (configuration.plugins || []).length > 0
  const shouldRender = configuration.theming?.menuLocation === MENU_LOCATION.topBar && hasPlugins
  const entriesMapper = useCallback((plugin: Plugin) => <TopBarMenuEntry key={plugin.id} {...plugin}/>, [])

  return (
    <>
      {shouldRender &&
      <div className='topBarMenu_container'>
        {configuration.plugins?.map(entriesMapper)}
      </div>
      }
    </>
  )
}

const TopBarMenuEntry: React.FC<Plugin> = (plugin) => {
  const [isActive, setIsActive] = useState<boolean>(isPluginLoaded(plugin))
  const pluginStrategy: PluginStrategy = retrievePluginStrategy(plugin)

  const topBarMenuContainerClasses = classNames('topBarMenu_entry', {active: isActive})

  useEffect(() => {
    return history.listen(() => setIsActive(isPluginLoaded(plugin)))
  }, [plugin])

  return (
    <div className={topBarMenuContainerClasses} onClick={pluginStrategy.handlePluginLoad}>
      <i className={'topBarMenuEntry_icon ' + (plugin.icon || '')}/>
      <span className='topBarMenuEntry_text'>{plugin.label}</span>
    </div>
  )
}
