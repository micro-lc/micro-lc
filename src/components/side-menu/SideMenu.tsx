import {Menu} from 'antd'
import React from 'react'

export interface MenuEntry {
  name: string
}

export interface SideMenuProps {
  entries: MenuEntry[]
}

export const SideMenu: React.FC<SideMenuProps> = ({entries}) => {
  const entriesMapper = (entry: MenuEntry) => <SideMenuEntry key={entry.name} {...entry}/>

  return (
    <Menu mode="inline">
      {entries.map(entriesMapper)}
    </Menu>
  )
}

const SideMenuEntry: React.FC<MenuEntry> = ({name}) => {
  return (
    <Menu.Item key={name}>
      {name}
    </Menu.Item>
  )
}
