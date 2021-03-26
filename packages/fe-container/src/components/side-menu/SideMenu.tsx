import React, {useCallback, useContext, useState} from 'react'
import PropTypes from 'prop-types'
import {Plugin} from '@mia-platform/core'

import {MenuOpenedContext} from '../../contexts/MenuOpened.context'
import {isPluginLoaded, PluginStrategy, retrievePluginStrategy} from '../../plugins/PluginsLoaderFacade'

import './SideMenu.less'

const sideMenuProps = {
  plugins: PropTypes.array
}

type SideMenuProps = PropTypes.InferProps<typeof sideMenuProps>

export const SideMenu: React.FC<SideMenuProps> = ({plugins}) => {
  const {isMenuOpened, setMenuOpened} = useContext(MenuOpenedContext)

  const closeMenu = useCallback(() => setMenuOpened(false), [setMenuOpened])

  const entriesMapper = useCallback((plugin: Plugin) => <SideMenuEntry key={plugin.id} {...plugin}/>, [])

  return (
    <>
      <div
        className={'sideMenu_overlay ' + (isMenuOpened ? '' : 'closed')} data-testid="layout-content-overlay"
        onClick={closeMenu}
      />
      <div className={'sideMenu ' + (isMenuOpened ? 'opened' : '')}>
        {plugins?.map(entriesMapper)}
      </div>
    </>
  )
}

SideMenu.propTypes = sideMenuProps

const SideMenuEntry: React.FC<Plugin> = (plugin) => {
  const [isActive, setIsActive] = useState<boolean>(isPluginLoaded(plugin))

  const menuClick = useCallback((plugin: Plugin) => {
    const pluginStrategy: PluginStrategy = retrievePluginStrategy(plugin)
    return () => {
      pluginStrategy.handlePluginLoad()
      setIsActive(isPluginLoaded(plugin))
    }
  }, [])

  return (
    <div className="sideMenu_voice" onClick={menuClick(plugin)}>
      <div className={'sideMenu_entry ' + (isActive ? 'active' : '')}>
        <i className={'sideMenu_icon ' + (plugin.icon || '')}/>
        <span className="sideMenu_label">{plugin.label}</span>
        {plugin.integrationMode === 'href' && <i className="fas fa-external-link-alt sideMenu_externalLink"/>}
      </div>
      <hr className="sideMenu_divider"/>
    </div>
  )
}
