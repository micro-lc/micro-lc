import React from 'react'
import PropTypes from 'prop-types'
import {Layout} from 'antd'
import {motion} from 'framer-motion'

import {SideMenu} from '../side-menu/SideMenu'

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
      <motion.nav
        animate={isOpened ? 'open' : 'closed'}
        transition={{ease: 'linear', duration: 0.2}}
        variants={variants}
      >
        <Layout.Sider width={250}>
          {isOpened && <SideMenu entries={[{name: 'entry_1'}, {name: 'entry_2'}]}/>}
        </Layout.Sider>
      </motion.nav>
      <Layout.Content data-testid="layout-content-overlay" onClick={closeSideMenu}/>
    </Layout>
  )
}

LayoutContent.propTypes = layoutContentProps
