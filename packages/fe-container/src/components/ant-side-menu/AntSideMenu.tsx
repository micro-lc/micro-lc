import React, {useCallback, useState} from 'react'
import {Layout, Menu} from 'antd'
import {FormattedMessage} from 'react-intl'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {Configuration, Plugin} from '@mia-platform/core'

import {onSelectHandler} from '@utils/menu/antMenuUnselectHandler'
import {menuItemMapper} from '@utils/menu/menuItemMapper'
import {isFixedSidebarCollapsed, toggleFixedSidebarState} from '@utils/settings/side-bar/SideBarSettings'

import './AntSideMenu.less'

const COLLAPSE_KEY = 'collapse'

type LoadedLauncherProps = { configuration: Configuration }

export const AntSideMenu: React.FC<LoadedLauncherProps> = ({configuration}) => {
  const [isCollapsed, setIsCollapsed] = useState(isFixedSidebarCollapsed())

  const collapseToggle = useCallback(() => {
    setIsCollapsed(prev => !prev)
    toggleFixedSidebarState()
  }, [])

  const hrefPlugins = configuration.plugins
    ?.filter((plugin: Plugin) => plugin.integrationMode === 'href')
    .map((plugin: Plugin) => plugin.id) || []
  const unselectableKeys = [COLLAPSE_KEY, ...hrefPlugins]

  const collapseIconClassnames = classNames('sideMenu_icon', 'fas', {
    'fa-chevron-left': !isCollapsed,
    'fa-chevron-right': isCollapsed
  })

  return (
    <Layout.Sider collapsed={isCollapsed} collapsible trigger={null}>
      <Menu className='fixedSideBar' onSelect={onSelectHandler(unselectableKeys)}>
        <Menu.Item
          className='sideMenu_voice'
          icon={<i className={collapseIconClassnames}/>}
          key={COLLAPSE_KEY}
          onClick={collapseToggle}
          title={<FormattedMessage id={'expand'}/>}
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
