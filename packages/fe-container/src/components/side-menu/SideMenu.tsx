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

  const menuIcon = useCallback((plugin: Plugin) => {
    return <i className={'sideMenu_icon ' + (plugin.icon || '')}/>
  }, [])

  const entriesMapper = useCallback((plugin: Plugin) => (
    <React.Fragment key={plugin.id}>
      <Menu.Item className="sideMenu_entry" icon={menuIcon(plugin)} onClick={manageEntryClick(plugin)}>
        {plugin.label}
      </Menu.Item>
      <Menu.Divider className='sideMenu_divider'/>
    </React.Fragment>
  ), [manageEntryClick, menuIcon])

  return (
    <Menu className='sideMenu_menu' mode="inline">
      {plugins?.map(entriesMapper)}
    </Menu>
  )
}

SideMenu.propTypes = sideMenuProps
