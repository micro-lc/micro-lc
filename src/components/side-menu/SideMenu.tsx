import React from 'react'
import PropTypes from 'prop-types'
import {Menu} from 'antd'

// Antd Header height is 64px
const menuHeight = window.innerHeight - 64
const style: {[key: string]: React.CSSProperties} = {
  menu: {
    height: `${menuHeight}px`,
    paddingTop: '24px',
    borderTop: '1px solid #d9d9d9'
  },
  divider: {
    width: '80%',
    minWidth: '80%',
    float: 'right',
    margin: 0
  }
}

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

export const SideMenu: React.FC<SideMenuProps> = ({entries}) => {
  const entriesMapper = (entry: MenuEntry) => (
    <React.Fragment key={entry.name}>
      <Menu.Item className="menu-entry">{entry.name}</Menu.Item>
      <Menu.Divider style={style.divider}/>
    </React.Fragment>
  )

  return (
    <Menu mode="inline" style={style.menu}>
      {entries.map(entriesMapper)}
    </Menu>
  )
}

SideMenu.propTypes = sideMenuProps
