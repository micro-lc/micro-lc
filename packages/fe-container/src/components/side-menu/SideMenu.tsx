import React from 'react'
import PropTypes from 'prop-types'
import {Menu} from 'antd'

import './SideMenu.less'
import {PluginStrategy, retrievePluginLoadingStrategy} from './PluginsLoaderFacade'

const hrefConfig = {
  url: PropTypes.string.isRequired,
  sameWindow: PropTypes.bool.isRequired
}

export type HrefConfig = PropTypes.InferProps<typeof hrefConfig>

const menuEntry = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  pluginStrategy: PropTypes.oneOf(['href', 'qiankun', 'iframe']).isRequired,
  hrefConfig: PropTypes.exact(hrefConfig).isRequired
}

export type MenuEntry = PropTypes.InferProps<typeof menuEntry>

const sideMenuProps = {
  entries: PropTypes.arrayOf(
    PropTypes.exact(menuEntry).isRequired
  ).isRequired
}

type SideMenuProps = PropTypes.InferProps<typeof sideMenuProps>

export const SideMenu: React.FC<SideMenuProps> = ({entries}) => {
  const manageEntryClick = (menuEntry: MenuEntry) => {
    const pluginStrategy: PluginStrategy = retrievePluginLoadingStrategy(menuEntry)
    return () => {
      pluginStrategy.handlePluginLoad()
    }
  }

  const entriesMapper = (entry: MenuEntry) => (
    <React.Fragment key={entry.id}>
      <Menu.Item className="menu-entry" onClick={manageEntryClick(entry)}>{entry.name}</Menu.Item>
      <Menu.Divider className='sideMenu_divider'/>
    </React.Fragment>
  )

  return (
    <Menu className='sideMenu_menu' mode="inline">
      {entries.map(entriesMapper)}
    </Menu>
  )
}

SideMenu.propTypes = sideMenuProps
