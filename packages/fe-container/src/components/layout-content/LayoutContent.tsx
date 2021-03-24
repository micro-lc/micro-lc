import React, {useCallback, useContext} from 'react'
import {Layout} from 'antd'

import {MenuOpenedContext} from '../../contexts/MenuOpened.context'
import {AnimatedLayoutSider} from './animated-layout-sider/AnimatedLayoutSider'
import {LayoutCenter} from './layout-center/layout-center'

import './LayoutContent.less'

export const LayoutContent: React.FC = () => {
  const {isMenuOpened, setMenuOpened} = useContext(MenuOpenedContext)
  const closeSideMenu = useCallback(() => setMenuOpened(false), [setMenuOpened])
  return (
    <Layout className="layout-container">
      <AnimatedLayoutSider isOpened={isMenuOpened}/>
      <LayoutCenter closeSideMenu={closeSideMenu}/>
    </Layout>
  )
}
