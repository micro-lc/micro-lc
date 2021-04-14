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
import React, {useCallback} from 'react'
import {Menu} from 'antd'
import {FormattedMessage} from 'react-intl'

import {logOutUser} from '@services/microlc/user.service'

import './UserMenuOverlay.less'

export const UserMenuOverlay: React.FC = () => {
  const logOut = useCallback(() => {
    logOutUser().subscribe(() => window.location.reload())
  }, [])
  return (
    <Menu className='userMenuOverlay_body'>
      <Menu.Item className='userMenuOverlay_entry'>
        <span className='userMenuOverlay_logout' onClick={logOut}>
          <FormattedMessage id='logout'/>
        </span>
      </Menu.Item>
    </Menu>
  )
}
