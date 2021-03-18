import {Layout} from 'antd'
import React from 'react'
import PropTypes from 'prop-types'

import {SideMenu} from '../side-menu/SideMenu'
import {motion} from 'framer-motion'

const {Sider, Content} = Layout

const layoutContentProps = {
  burgerState: PropTypes.array.isRequired
}

type LayoutContentProps = PropTypes.InferProps<typeof layoutContentProps>

export const LayoutContent: React.FC<LayoutContentProps> = ({burgerState: [isOpened, setOpened]}) => {
  const closeSideMenu = () => setOpened(false)

  const variants = {
    open: {opacity: 1, x: 0},
    closed: {opacity: 0, x: '-100%'}
  }

  return (
    <Layout>
      <motion.nav animate={isOpened ? 'open' : 'closed'} variants={variants}>
        <Sider>
          {isOpened && <SideMenu entries={[{name: 'entry_1'}, {name: 'entry_2'}]}/>}
        </Sider>
      </motion.nav>
      <Content onClick={closeSideMenu}/>
    </Layout>
  )
}

LayoutContent.propTypes = layoutContentProps
