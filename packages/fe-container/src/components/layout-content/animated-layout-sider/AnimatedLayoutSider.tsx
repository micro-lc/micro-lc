import PropTypes from 'prop-types'
import React, {useContext, useEffect} from 'react'
import {useDelayedState} from '../../../hooks/useDelayedState'
import {ConfigurationContext} from '../../../contexts/Configuration.context'
import {motion} from 'framer-motion'
import {Layout} from 'antd'
import {SideMenu} from '../../side-menu/SideMenu'

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

export const AnimatedLayoutSider: React.FC<AnimatedLayoutProps> = ({isOpened}) => {
  const [animationState] = useDelayedState(isOpened, 250)
  const configuration = useContext(ConfigurationContext)

  useEffect(() => {
    document.title = configuration?.theming?.header?.pageTitle || document.title
  }, [configuration])

  return (
    <motion.nav animate={isOpened ? 'open' : 'closed'} {...motionNavSettings}>
      {animationState && <Layout.Sider width={256}>
        <SideMenu plugins={configuration?.plugins}/>
      </Layout.Sider>}
    </motion.nav>
  )
}

AnimatedLayoutSider.propTypes = animatedLayoutProps
