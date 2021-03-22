import React from 'react'
import PropTypes from 'prop-types'
import {Layout} from 'antd'
import {motion} from 'framer-motion'

import {SideMenu} from '../side-menu/SideMenu'
import {useDelayedState} from '../../hooks/useDelayedState'

const layoutContentProps = {
  burgerState: PropTypes.array.isRequired
}

type LayoutContentProps = PropTypes.InferProps<typeof layoutContentProps>

export const LayoutContent: React.FC<LayoutContentProps> = ({burgerState: [isOpened, setOpened]}) => {
  const closeSideMenu = () => setOpened(false)

  return (
    <Layout>
      <AnimatedLayoutSider isOpened={isOpened}/>
      <Layout.Content data-testid="layout-content-overlay" onClick={closeSideMenu}/>
    </Layout>
  )
}

LayoutContent.propTypes = layoutContentProps

const animatedLayoutProps = {
  isOpened: PropTypes.bool.isRequired
}

type AnimatedLayoutProps = PropTypes.InferProps<typeof animatedLayoutProps>

const motionNavSettings = {
  transition: {ease: 'linear', duration: 0.2},
  variants: {
    open: {opacity: 1, x: 0},
    closed: {opacity: 0, x: '-100%'}
  }
}

const AnimatedLayoutSider: React.FC<AnimatedLayoutProps> = ({isOpened}) => {
  const [animationState] = useDelayedState(isOpened, 250)

  return (
    <motion.nav
      animate={isOpened ? 'open' : 'closed'}
      {...motionNavSettings}
    >
      <Layout.Sider width={256}>
        {animationState && <SideMenu entries={[{name: 'entry_1'}, {name: 'entry_2'}]}/>}
      </Layout.Sider>
    </motion.nav>
  )
}

AnimatedLayoutSider.propTypes = animatedLayoutProps
