import React, {useCallback, useContext, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {Plugin} from '@mia-platform/core'
import classNames from 'classnames'

import {MenuOpenedContext} from '@contexts/MenuOpened.context'
import {history, isPluginLoaded, PluginStrategy, retrievePluginStrategy} from '../../utils/plugins/PluginsLoaderFacade'

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
        {plugins?.map(entriesMapper)}
      </div>
      <div className={sideMenuOverlayClasses} data-testid="layout-content-overlay" onClick={closeMenu}/>
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
    }
  }, [])

  useEffect(() => {
    return history.listen(() => setIsActive(isPluginLoaded(plugin)))
  }, [plugin])

  return (
    <div className={'sideMenu_voice ' + (isActive ? 'active' : '')} onClick={menuClick(plugin)}>
      <i className={'sideMenu_icon ' + (plugin.icon || '')}/>
      <div className='sideMenu_entry'>
        <span className='sideMenu_label'>{plugin.label}</span>
        {plugin.integrationMode === 'href' && <i className='fas fa-external-link-alt sideMenu_externalLink'/>}
      </div>
    </div>
  )
}
