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
import {Plugin} from '@mia-platform/core'
import {retrievePluginStrategy} from '@utils/plugins/PluginsLoaderFacade'
import {Menu} from 'antd'
import React from 'react'

const menuEntry = (plugin: Plugin) => {
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

const menuCategory = ([categoryName, plugins]: [string, Plugin[]]) => {
  return (
    <Menu.ItemGroup key={categoryName} title={categoryName}>
      {(plugins).map(menuEntry)}
    </Menu.ItemGroup>
  )
}

type Categories = { [key: string]: Plugin[] }

const menuContainer = (plugin: Plugin) => {
  const pluginContent: Plugin[] = plugin.content || []
  const withoutCategories = pluginContent.filter(plugin => !plugin.category)
  const categoriesDivision: Categories = pluginContent.filter(plugin => plugin.category)
    .reduce((previous: any, plugin) => {
      // @ts-ignore
      previous[plugin.category] = [...previous[plugin.category] || [], plugin]
      return previous
    }, {})

  return (
    <Menu.SubMenu
      className='sideMenu_voice_container'
      icon={<i className={'sideMenu_icon ' + (plugin.icon || '')}/>}
      key={plugin.id}
      title={plugin.label}
    >
      {Object.entries(categoriesDivision).map(menuCategory)}
      {withoutCategories.map(menuEntry)}
    </Menu.SubMenu>
  )
}

export const menuItemMapper = (plugin: Plugin) => {
  const isContainer = plugin.content !== undefined
  return isContainer ? menuContainer(plugin) : menuEntry(plugin)
}
