import {Menu} from 'antd'
import React from 'react'
import PropTypes from 'prop-types'

const menuEntry = {
  name: PropTypes.string.isRequired
}

type MenuEntry = PropTypes.InferProps<typeof menuEntry>

const sideMenuProps = {
  entries: PropTypes.arrayOf(
    PropTypes.exact(menuEntry).isRequired
  ).isRequired
}

type SideMenuProps = PropTypes.InferProps<typeof sideMenuProps>

const dividerStyle: React.CSSProperties = {margin: 0, width: '80%', minWidth: '80%', float: 'right'}

export const SideMenu: React.FC<SideMenuProps> = ({entries}) => {
  const entriesMapper = (entry: MenuEntry) => (
    <React.Fragment key={entry.name}>
      <Menu.Item className="menu-entry">{entry.name}</Menu.Item>
      <Menu.Divider style={dividerStyle}/>
    </React.Fragment>
  )

  return (
    <Menu mode="inline" style={{height: '90.5vh', marginTop: '24px'}}>
      {entries.map(entriesMapper)}
    </Menu>
  )
}

SideMenu.propTypes = sideMenuProps
