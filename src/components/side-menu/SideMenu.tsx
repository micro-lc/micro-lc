import {Divider, Menu} from 'antd'
import React from 'react'

export interface MenuEntry {
  name: string
}

export interface SideMenuProps {
  entries: MenuEntry[]
}

const dividerStyle: React.CSSProperties = {margin: 0, width: '80%', minWidth: '80%', float: 'right'}

export const SideMenu: React.FC<SideMenuProps> = ({entries}) => {
  const entriesMapper = (entry: MenuEntry) => (
    <React.Fragment key={entry.name}>
      <Menu.Item className="menu-entry" key={entry.name}>{entry.name}</Menu.Item>
      <Divider style={dividerStyle} type="horizontal"/>
    </React.Fragment>
  )

  return (
    <Menu mode="inline" style={{height: '93vh'}}>
      {entries.map(entriesMapper)}
    </Menu>
  )
}
