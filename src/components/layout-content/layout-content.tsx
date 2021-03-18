import {Layout} from 'antd'
import React from 'react'
import PropTypes from 'prop-types'

import {SideMenu} from '../side-menu/SideMenu'

const {Sider} = Layout

const layoutContentProps = {
  isSideMenuOpened: PropTypes.bool
}

type LayoutContentProps = PropTypes.InferProps<typeof layoutContentProps>

export const LayoutContent: React.FC<LayoutContentProps> = ({isSideMenuOpened}) => {
  return (
    <Layout>
      <Sider>
        {isSideMenuOpened && <SideMenu entries={[{name: 'entry_1'}, {name: 'entry_2'}]}/>}
      </Sider>
    </Layout>
  )
}

LayoutContent.propTypes = layoutContentProps
