import React, {useCallback} from 'react'
import {Menu} from 'antd'
import {Plugin} from '@mia-platform/core'
import PropTypes from 'prop-types'

import './SideMenu.less'
import {PluginStrategy, retrievePluginStrategy} from '../../plugins/PluginsLoaderFacade'
import {MenuInfo} from 'rc-menu/lib/interface'

const sideMenuProps = {
  plugins: PropTypes.array
}

type SideMenuProps = PropTypes.InferProps<typeof sideMenuProps>

const avoidMenuSelectIfHref = (event: MenuInfo, plugin: Plugin) => {
  if (plugin.integrationMode === 'href') {
    event.domEvent.preventDefault()
    event.domEvent.stopPropagation()
    event.key = ''
  }
}

const manageEntryClick = (plugin: Plugin) => {
  const pluginStrategy: PluginStrategy = retrievePluginStrategy(plugin)
  return (event: MenuInfo) => {
    avoidMenuSelectIfHref(event, plugin)
    pluginStrategy.handlePluginLoad()
  }
}

export const SideMenu: React.FC<SideMenuProps> = ({plugins}) => {
  const menuIcon = useCallback((plugin: Plugin) => {
    return <i className={'sideMenu_icon ' + (plugin.icon || '')}/>
  }, [])

  const entriesMapper = useCallback((plugin: Plugin) => (
    <React.Fragment key={plugin.id}>
      <Menu.Item className="sideMenu_entry" icon={menuIcon(plugin)} onClick={manageEntryClick(plugin)}>
        {plugin.label}
        {plugin.integrationMode === 'href' && <i className="fas fa-external-link-alt sideMenu_icon external"/>}
      </Menu.Item>
      <Menu.Divider className='sideMenu_divider'/>
    </React.Fragment>
  ), [menuIcon])

  return (
    <Menu className='sideMenu_menu' mode="inline">
      {plugins?.map(entriesMapper)}
    </Menu>
  )
}

SideMenu.propTypes = sideMenuProps
