import React, {useContext, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {Layout} from 'antd'
import {motion} from 'framer-motion'

import {MenuEntry, SideMenu} from '../side-menu/SideMenu'
import {useDelayedState} from '../../hooks/useDelayedState'
import menuEntriesMapper from './MenuEntriesMapper'
import {MenuOpenedContext} from '../../contexts/MenuOpened.context'
import {ConfigurationContext} from '../../contexts/Configuration.context'

export const LayoutContent: React.FC = () => {
  const {isMenuOpened, setMenuOpened} = useContext(MenuOpenedContext)
  const closeSideMenu = () => setMenuOpened(false)

  return (
    <Layout>
      <AnimatedLayoutSider isOpened={isMenuOpened}/>
      <Layout.Content data-testid="layout-content-overlay" onClick={closeSideMenu}/>
    </Layout>
  )
}

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
  const [menuEntries, setMenuEntries] = useState<MenuEntry[]>([])
  const configuration = useContext(ConfigurationContext)

  useEffect(() => {
    document.title = configuration?.theming?.header?.pageTitle || document.title
    setMenuEntries(menuEntriesMapper(configuration?.plugins))
  }, [configuration])

  return (
    <motion.nav
      animate={isOpened ? 'open' : 'closed'}
      {...motionNavSettings}
    >
      <Layout.Sider width={256}>
        {animationState && <SideMenu entries={menuEntries}/>}
      </Layout.Sider>
    </motion.nav>
  )
}

AnimatedLayoutSider.propTypes = animatedLayoutProps
