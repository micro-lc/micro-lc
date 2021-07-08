import React, {useCallback, useState} from 'react'
import {Layout, Menu} from 'antd'
import {FormattedMessage} from 'react-intl'
import PropTypes from 'prop-types'
import {Configuration, Plugin} from '@mia-platform/core'

import {onSelectHandler} from '@utils/menu/antMenuUnselectHandler'
import {menuItemMapper} from '@utils/menu/menuItemMapper'

import './AntSideMenu.less'

const COLLAPSE_KEY = 'collapse'

type LoadedLauncherProps = { configuration: Configuration }

export const AntSideMenu: React.FC<LoadedLauncherProps> = ({configuration}) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const collapseToggle = useCallback(() => setIsCollapsed(prev => !prev), [])

  const hrefPlugins = configuration.plugins
    ?.filter((plugin: Plugin) => plugin.integrationMode === 'href')
    .map((plugin: Plugin) => plugin.id) || []
  const unselectableKeys = [COLLAPSE_KEY, ...hrefPlugins]

  return (
    <Layout.Sider collapsed={isCollapsed} collapsible trigger={null}>
      <Menu className='fixedSideBar' onSelect={onSelectHandler(unselectableKeys)}>
        <Menu.Item
          className='sideMenu_voice'
          icon={<i className='sideMenu_icon fas fa-compress-alt'/>}
          key={COLLAPSE_KEY}
          onClick={collapseToggle}
        >
          <CollapseItem/>
        </Menu.Item>
        <Menu.Divider className='divider'/>
        {configuration.plugins?.map(menuItemMapper)}
      </Menu>
    </Layout.Sider>
  )
}

AntSideMenu.propTypes = {
  configuration: PropTypes.any.isRequired
}

const CollapseItem: React.FC = () => {
  return (
    <div className='sideMenu_entry'>
      <FormattedMessage id={'collapse'}/>
    </div>
  )
}
