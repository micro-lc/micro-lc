import {Menu} from 'antd'
import React from 'react'

export interface MenuEntry {
  name: string
}

export interface SideMenuProps {
  entries: MenuEntry[]
}

export const SideMenu: React.FC<SideMenuProps> = ({entries}) => {
  const entriesMapper = (entry: MenuEntry) => (<Menu.Item key={entry.name}>{entry.name}</Menu.Item>)

  return (
    <Menu mode="inline">
      {entries.map(entriesMapper)}
    </Menu>
  )
}
