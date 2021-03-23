import React, {useCallback} from 'react'
import {Menu} from 'antd'
import {Plugin} from '@mia-platform/core'
import PropTypes from 'prop-types'

import './SideMenu.less'
import {PluginStrategy, retrievePluginStrategy} from '../../plugins/PluginsLoaderFacade'

const sideMenuProps = {
  plugins: PropTypes.array
}

type SideMenuProps = PropTypes.InferProps<typeof sideMenuProps>

export const SideMenu: React.FC<SideMenuProps> = ({plugins}) => {
  const manageEntryClick = useCallback((plugin: Plugin) => {
    const pluginStrategy: PluginStrategy = retrievePluginStrategy(plugin)
    return () => {
      pluginStrategy.handlePluginLoad()
    }
  }, [])

  const entriesMapper = useCallback((plugin: Plugin) => (
    <React.Fragment key={plugin.id}>
      <Menu.Item className="menu-entry" onClick={manageEntryClick(plugin)}>{plugin.label}</Menu.Item>
      <Menu.Divider className='sideMenu_divider'/>
    </React.Fragment>
  ), [])

  const entriesSorter = useCallback(
    (pluginA: Plugin, pluginB: Plugin) => (pluginA.order || 0) - (pluginB.order || 0),
    [])

  return (
    <Menu className='sideMenu_menu' mode="inline">
      {plugins?.sort(entriesSorter).map(entriesMapper)}
    </Menu>
  )
}

SideMenu.propTypes = sideMenuProps
