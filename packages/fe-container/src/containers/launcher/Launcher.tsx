/*
 * Copyright 2021 Mia srl
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React, {useMemo, useState} from 'react'
import PropTypes from 'prop-types'
import {LoadingAnimation} from '@mia-platform/microlc-ui-components'
import {Configuration} from '@mia-platform/core'

import {ConfigurationProvider} from '@contexts/Configuration.context'
import {MenuOpenedProvider} from '@contexts/MenuOpened.context'
import {AppState} from '@hooks/useAppData/useAppData'
import {UserContextProvider} from '@contexts/User.context'
import {isFixedSideBarToShow, isSideBarToShow} from '@utils/settings/side-bar/SideBarSettings'

import {SideBarLayout} from './layouts/side-bar-layout/SideBarLayout'
import {FixedSideBarLayout} from './layouts/fixed-side-bar-layout/FixedSideBarLayout'
import {NoSideBarLayout} from './layouts/no-side-bar-layout/NoSideBarLayout'

import './Launcher.less'
import {Helmet} from 'react-helmet'

export const Launcher: React.FC<AppState> = ({configuration, isLoading, user}) => {
  return isLoading ? <LoadingAnimation/> : <LoadedLauncher configuration={configuration} user={user}/>
}

type LoadedLauncherProps = Omit<AppState, 'isLoading'>

const retrieveLayout = (configuration: Configuration) => {
  let componentToRender: React.FC<LoadedLauncherProps> = NoSideBarLayout
  if (isSideBarToShow(configuration)) {
    componentToRender = SideBarLayout
  } else if (isFixedSideBarToShow(configuration)) {
    componentToRender = FixedSideBarLayout
  }
  return componentToRender
}

const LoadedLauncher: React.FC<LoadedLauncherProps> = ({configuration, user}) => {
  const layout = useMemo(() => retrieveLayout(configuration), [configuration])
  const headerConfig = configuration.theming?.header

  return (
    <AppProvider configuration={configuration} user={user}>
      {
        headerConfig &&
        <Helmet>
          <link href={headerConfig.favicon} rel="icon" type="image/png"/>
        </Helmet>
      }
      {React.createElement(layout, {configuration, user})}
    </AppProvider>
  )
}

const AppProvider: React.FC<LoadedLauncherProps> = ({configuration, user, children}) => {
  const [isMenuOpened, setMenuOpened] = useState(false)
  return (
    <ConfigurationProvider value={configuration}>
      <UserContextProvider value={user}>
        <MenuOpenedProvider value={{isMenuOpened, setMenuOpened}}>
          {children}
        </MenuOpenedProvider>
      </UserContextProvider>
    </ConfigurationProvider>
  )
}

LoadedLauncher.propTypes = {
  configuration: PropTypes.any.isRequired,
  user: PropTypes.any.isRequired
}

AppProvider.propTypes = {
  ...LoadedLauncher.propTypes
}

Launcher.propTypes = {
  ...LoadedLauncher.propTypes,
  isLoading: PropTypes.bool.isRequired
}
