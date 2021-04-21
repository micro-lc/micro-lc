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
import PropTypes from 'prop-types'
import {Plugin} from '@mia-platform/core'
import classNames from 'classnames'

import {MenuOpenedContext} from '@contexts/MenuOpened.context'
import {history, isPluginLoaded, PluginStrategy, retrievePluginStrategy} from '@utils/plugins/PluginsLoaderFacade'

import './SideMenu.less'

const sideMenuProps = {
  plugins: PropTypes.array
}

type SideMenuProps = PropTypes.InferProps<typeof sideMenuProps>

export const SideMenu: React.FC<SideMenuProps> = ({plugins}) => {
  const {isMenuOpened, setMenuOpened} = useContext(MenuOpenedContext)

  const closeMenu = useCallback(() => setMenuOpened(false), [setMenuOpened])

  const entriesMapper = useCallback((plugin: Plugin) => <SideMenuEntry key={plugin.id} {...plugin}/>, [])

  const sideMenuClasses = classNames('sideMenu', {opened: isMenuOpened})
  const sideMenuOverlayClasses = classNames('sideMenu_overlay', {sideMenu_visible: isMenuOpened})

  return (
    <>
      <div className={sideMenuClasses}>
        <div onClick={closeMenu}>
          {plugins?.map(entriesMapper)}
        </div>
      </div>
      <div className={sideMenuOverlayClasses} data-testid="layout-content-overlay" onClick={closeMenu}/>
    </>
  )
}

SideMenu.propTypes = sideMenuProps

const SideMenuEntry: React.FC<Plugin> = (plugin) => {
  const [isActive, setIsActive] = useState<boolean>(isPluginLoaded(plugin))
  const pluginStrategy: PluginStrategy = retrievePluginStrategy(plugin)

  useEffect(() => {
    return history.listen(() => setIsActive(isPluginLoaded(plugin)))
  }, [plugin])

  return (
    <div className={'sideMenu_voice ' + (isActive ? 'active' : '')} onClick={pluginStrategy.handlePluginLoad}>
      <i className={'sideMenu_icon ' + (plugin.icon || '')}/>
      <div className='sideMenu_entry'>
        <span className='sideMenu_label'>{plugin.label}</span>
        {plugin.integrationMode === 'href' && <i className='fas fa-external-link-alt sideMenu_externalLink'/>}
      </div>
    </div>
  )
}
