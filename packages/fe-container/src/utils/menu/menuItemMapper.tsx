import {Plugin} from '@mia-platform/core'
import {retrievePluginStrategy} from '@utils/plugins/PluginsLoaderFacade'
import {Menu} from 'antd'
import React from 'react'

export const menuItemMapper = (plugin: Plugin) => {
  const pluginStrategy = retrievePluginStrategy(plugin)
  return (
    <Menu.Item
      className='sideMenu_voice'
      icon={<i className={'sideMenu_icon ' + (plugin.icon || '')}/>}
      key={plugin.id}
      onClick={pluginStrategy.handlePluginLoad}
    >
      <div className='sideMenu_entry'>
        <span className='sideMenu_label'>{plugin.label}</span>
        {plugin.integrationMode === 'href' && <i className='fas fa-external-link-alt sideMenu_externalLink'/>}
      </div>
    </Menu.Item>
  )
}
