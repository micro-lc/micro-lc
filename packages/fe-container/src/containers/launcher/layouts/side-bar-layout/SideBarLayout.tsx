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
import {Layout} from 'antd'
import React from 'react'

import {TopBar} from '@components/top-bar/TopBar'
import {SideMenu} from '@components/side-menu/SideMenu'
import {LayoutContent} from '@components/layout-content/LayoutContent'
import {FooterBar} from '@components/footer-bar/FooterBar'
import {AppState} from '@hooks/useAppData/useAppData'
import PropTypes from 'prop-types'

type LoadedLauncherProps = Omit<AppState, 'isLoading'>

export const SideBarLayout: React.FC<LoadedLauncherProps> = ({configuration, user}) => {
  return (
    <Layout>
      <Layout.Header className='launcher_header'>
        <TopBar/>
      </Layout.Header>
      <Layout.Content className='launcher_content_container'>
        <SideMenu plugins={configuration.plugins}/>
        <LayoutContent/>
      </Layout.Content>
      <Layout.Footer className='launcher_footer'>
        <FooterBar />
      </Layout.Footer>
    </Layout>
  )
}

SideBarLayout.propTypes = {
  configuration: PropTypes.any.isRequired,
  user: PropTypes.any.isRequired
}
