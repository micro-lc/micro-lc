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
import React, {useCallback, useContext, useMemo} from 'react'
import PropTypes from 'prop-types'
import {Drawer, DrawerProps, Menu} from 'antd'

import {Plugin} from '@mia-platform/core'

import {MenuOpenedContext} from '@contexts/MenuOpened.context'
import {onSelectHandler} from '@utils/menu/antMenuUnselectHandler'
import {menuItemMapper} from '@utils/menu/menuItemMapper'

import './SideMenu.less'
import {useCurrentPlugin} from '@hooks/useCurrentPlugin/useCurrentPlugin'

const COLLAPSE_KEY = 'collapse'

const sideMenuProps = {
  plugins: PropTypes.array
}

type SideMenuProps = PropTypes.InferProps<typeof sideMenuProps>

const isHref = (plugin: Plugin) => plugin.integrationMode === 'href'
const idExtractor = (plugin: Plugin) => plugin.id
const drawerProps: DrawerProps = {
  className: 'sideMenu_drawer',
  closable: false,
  getContainer: false,
  placement: 'left',
  style: {position: 'absolute'}
}

export const SideMenu: React.FC<SideMenuProps> = ({plugins}) => {
  const {isMenuOpened, setMenuOpened} = useContext(MenuOpenedContext)

  const currentPlugin = useCurrentPlugin()

  const menuItems = useMemo(() => plugins?.map(menuItemMapper), [plugins])

  const closeMenu = useCallback(() => setMenuOpened(false), [setMenuOpened])

  const hrefPlugins = plugins?.filter(isHref).map(idExtractor) || []
  const unselectableKeys = [COLLAPSE_KEY, ...hrefPlugins]

  return (
    <Drawer {...drawerProps} onClose={closeMenu} visible={isMenuOpened}>
      <Menu className='fixedSideBar' onClick={closeMenu} onSelect={onSelectHandler(unselectableKeys)} selectedKeys={[currentPlugin?.id || '']}>
        {menuItems}
      </Menu>
    </Drawer>
  )
}

SideMenu.propTypes = sideMenuProps
