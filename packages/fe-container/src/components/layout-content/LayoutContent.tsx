import React, {useCallback, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Layout} from 'antd'
import {motion} from 'framer-motion'
import {Route, Router, Switch} from 'react-router-dom'
import {Plugin} from '@mia-platform/core'

import {SideMenu} from '../side-menu/SideMenu'
import {useDelayedState} from '../../hooks/useDelayedState'
import {MenuOpenedContext} from '../../contexts/MenuOpened.context'
import {ConfigurationContext} from '../../contexts/Configuration.context'
import {history} from '../../plugins/PluginsLoaderFacade'

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

const layoutCenterProps = {
  closeSideMenu: PropTypes.func.isRequired
}

type LayoutCenterProps = PropTypes.InferProps<typeof layoutCenterProps>

const LayoutCenter: React.FC<LayoutCenterProps> = ({closeSideMenu}) => {
  const configuration = useContext(ConfigurationContext)
  const routerFilter = useCallback((plugin: Plugin) => plugin.pluginRoute, [])
  const routerMapper = useCallback((plugin: Plugin) => {
    return (
      <Route key={plugin.id} path={plugin.pluginRoute}>
        <CenterPluginManager {...plugin}/>
      </Route>
    )
  }, [])

  return (
    <Layout.Content data-testid="layout-content-overlay" onClick={closeSideMenu}>
      <Router history={history}>
        <Switch>
          {configuration.plugins?.filter(routerFilter).map(routerMapper)}
        </Switch>
      </Router>
    </Layout.Content>
  )
}

LayoutCenter.propTypes = layoutCenterProps

const CenterPluginManager: React.FC<Plugin> = (plugin) => {
  return (
    <>
      {plugin.integrationMode === 'iframe' &&
      <iframe className="layout-iframe" src={plugin.pluginUrl} title={plugin.id}/>}
      {plugin.integrationMode === 'qiankun' && <div id={plugin.id}/>}
    </>
  )
}
