import React, {useCallback, useContext} from 'react'
import {Layout} from 'antd'

import {MenuOpenedContext} from '../../contexts/MenuOpened.context'
import {LayoutCenter} from './layout-center/LayoutCenter'

import './LayoutContent.less'

export const LayoutContent: React.FC = () => {
  const {isMenuOpened, setMenuOpened} = useContext(MenuOpenedContext)

  const closeSideMenu = useCallback(() => setMenuOpened(false), [setMenuOpened])

  return (
    <Layout className={isMenuOpened ? 'layout-container-overlay' : ''} onClick={closeSideMenu}>
      <LayoutCenter/>
    </Layout>
  )
}
