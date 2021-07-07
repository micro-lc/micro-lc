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
import React, {useCallback, useContext} from 'react'
import PropTypes from 'prop-types'
import {Drawer, Menu} from 'antd'

import {Plugin} from '@mia-platform/core'

import {MenuOpenedContext} from '@contexts/MenuOpened.context'
import {retrievePluginStrategy} from '@utils/plugins/PluginsLoaderFacade'
import {onSelectHandler} from '@utils/menu/antMenuUnselectHandler'

import './SideMenu.less'

const COLLAPSE_KEY = 'collapse'

const sideMenuProps = {
  plugins: PropTypes.array
}

type SideMenuProps = PropTypes.InferProps<typeof sideMenuProps>

const menuItemMapper = (plugin: Plugin) => {
  const pluginStrategy = retrievePluginStrategy(plugin)
  return (
    <Menu.Item
      className='fixedSideMenu_voice'
      icon={<i className={'fixedSideMenu_icon ' + (plugin.icon || '')}/>}
      key={plugin.id}
      onClick={pluginStrategy.handlePluginLoad}
    >
      <div className='fixedSideMenu_entry'>
        <span className='fixedSideMenu_label'>{plugin.label}</span>
        {plugin.integrationMode === 'href' && <i className='fas fa-external-link-alt sideMenu_externalLink'/>}
      </div>
    </Menu.Item>
  )
}

export const SideMenu: React.FC<SideMenuProps> = ({plugins}) => {
  const {isMenuOpened, setMenuOpened} = useContext(MenuOpenedContext)

  const closeMenu = useCallback(() => setMenuOpened(false), [setMenuOpened])

  const hrefPlugins = plugins
    ?.filter((plugin: Plugin) => plugin.integrationMode === 'href')
    .map((plugin: Plugin) => plugin.id) || []
  const unselectableKeys = [COLLAPSE_KEY, ...hrefPlugins]

  return (
    <Drawer
      className='sideMenu_drawer'
      closable={false}
      getContainer={false}
      onClose={closeMenu}
      placement='left'
      style={{position: 'absolute'}}
      visible={isMenuOpened}
    >
      <Menu className='fixedSideBar' onSelect={onSelectHandler(unselectableKeys)}>
        {plugins?.map(menuItemMapper)}
      </Menu>
    </Drawer>
  )
}

SideMenu.propTypes = sideMenuProps

// const SideMenuEntry: React.FC<Plugin> = (plugin) => {
//   const [isActive, setIsActive] = useState<boolean>(isPluginLoaded(plugin))
//   const pluginStrategy: PluginStrategy = retrievePluginStrategy(plugin)
//
//   useEffect(() => {
//     return history.listen(() => setIsActive(isPluginLoaded(plugin)))
//   }, [plugin])
//
//   const sideMenuVoiceClasses = classNames('sideMenu_voice', {active: isActive})
//
//   return (
//     <div className={sideMenuVoiceClasses} onClick={pluginStrategy.handlePluginLoad}>
//       <i className={'sideMenu_icon ' + (plugin.icon || '')}/>
//       <div className='sideMenu_entry'>
//         <span className='sideMenu_label'>{plugin.label}</span>
//         {plugin.integrationMode === 'href' && <i className='fas fa-external-link-alt sideMenu_externalLink'/>}
//       </div>
//     </div>
//   )
// }
