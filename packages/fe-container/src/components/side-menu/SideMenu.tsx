import React from 'react'
import PropTypes from 'prop-types'
import {Menu} from 'antd'

import './SideMenu.less'

const menuEntry = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
}

export type MenuEntry = PropTypes.InferProps<typeof menuEntry>

const sideMenuProps = {
  entries: PropTypes.arrayOf(
    PropTypes.exact(menuEntry).isRequired
  ).isRequired
}

type SideMenuProps = PropTypes.InferProps<typeof sideMenuProps>

export const SideMenu: React.FC<SideMenuProps> = ({entries}) => {
  const entriesMapper = (entry: MenuEntry) => (
    <React.Fragment key={entry.id}>
      <Menu.Item className="menu-entry">{entry.name}</Menu.Item>
      <Menu.Divider className='sideMenu_divider'/>
    </React.Fragment>
  )

  return (
    <Menu className='sideMenu_menu' mode="inline">
      {entries.map(entriesMapper)}
    </Menu>
  )
}

SideMenu.propTypes = sideMenuProps
