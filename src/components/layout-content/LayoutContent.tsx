import {Layout} from 'antd'
import React from 'react'
import PropTypes from 'prop-types'

import {SideMenu} from '../side-menu/SideMenu'

const {Sider, Content} = Layout

const layoutContentProps = {
  burgerState: PropTypes.array.isRequired
}

type LayoutContentProps = PropTypes.InferProps<typeof layoutContentProps>

export const LayoutContent: React.FC<LayoutContentProps> = ({burgerState: [isOpened, setOpened]}) => {
  const closeSideMenu = () => setOpened(false)

  return (
    <Layout>
      <Sider>
        {isOpened && <SideMenu entries={[{name: 'entry_1'}, {name: 'entry_2'}]}/>}
      </Sider>
      <Content onClick={closeSideMenu}/>
    </Layout>
  )
}

LayoutContent.propTypes = layoutContentProps
