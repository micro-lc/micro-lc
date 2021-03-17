import {SideMenu} from '../side-menu/SideMenu'
import {Layout} from 'antd'
import React from 'react'

const {Sider} = Layout

export interface LayoutContentProps {
  isSideMenuOpened?: boolean
}

export const LayoutContent: React.FC<LayoutContentProps> = ({isSideMenuOpened}) => {
  return (
    <Layout>
      <Sider>
        {isSideMenuOpened && <SideMenu entries={[{name: 'entry_1'}, {name: 'entry_2'}]}/>}
      </Sider>
    </Layout>
  )
}
