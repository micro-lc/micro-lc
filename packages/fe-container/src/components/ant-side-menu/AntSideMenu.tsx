import React, {useCallback, useState} from 'react'
import {Layout, Menu} from 'antd'
import {FormattedMessage} from 'react-intl'
import PropTypes from 'prop-types'
import {Configuration, Plugin} from '@mia-platform/core'

import {onSelectHandler} from '@utils/menu/antMenuUnselectHandler'
import {retrievePluginStrategy} from '@utils/plugins/PluginsLoaderFacade'

import './AntSideMenu.less'

const COLLAPSE_KEY = 'collapse'

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
          className='fixedSideMenu_voice'
          icon={<i className='fixedSideMenu_icon fas fa-compress-alt'/>}
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
    <div className='fixedSideMenu_entry'>
      <FormattedMessage id={'collapse'}/>
    </div>
  )
}
