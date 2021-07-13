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
import PropTypes from 'prop-types'

import {TopBar} from '@components/top-bar/TopBar'
import {LayoutContent} from '@components/layout-content/LayoutContent'
import {FooterBar} from '@components/footer-bar/FooterBar'
import {AppState} from '@hooks/useAppData/useAppData'
import {AntSideMenu} from '@components/ant-side-menu/AntSideMenu'

import './FixedSideBar.less'

type LoadedLauncherProps = Omit<AppState, 'isLoading'>

export const FixedSideBarLayout: React.FC<LoadedLauncherProps> = ({configuration}) => {
  return (
    <Layout data-testid='fixed-side-bar'>
      <Layout.Header className='launcher_header'>
        <TopBar/>
      </Layout.Header>
      <Layout className='fixedSideBar_layout_content'>
        <AntSideMenu configuration={configuration}/>
        <Layout.Content className='launcher_content_container'>
          <LayoutContent/>
        </Layout.Content>
      </Layout>
      <Layout.Footer className='launcher_footer'>
        <FooterBar/>
      </Layout.Footer>
    </Layout>
  )
}

FixedSideBarLayout.propTypes = {
  configuration: PropTypes.any.isRequired
}
