/**
  Copyright 2022 Mia srl

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
import { DownOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Dropdown, Menu } from 'antd'
import React, { useMemo } from 'react'

import type { Translations } from '../../lang'
import type { User } from '../../web-components/mlc-layout/types'

export interface UserMenuProps {
  canLogout: boolean | undefined
  locale: Translations['MLC-LAYOUT'] | undefined
  onUserMenuClick: MenuProps['onClick'] | undefined
  user: User
}

const UserInfo: React.FC<Pick<UserMenuProps, 'canLogout' | 'user'>> = ({ canLogout, user }) => {
  const userAvatar = useMemo(() => {
    const fallbackUrl = `https://eu.ui-avatars.com/api/?name=${user.name ?? ''}&size=24x24`
    return user.avatar ?? fallbackUrl
  }, [user])

  return (
    <div className={`user-menu-container ${canLogout ? 'user-menu-container-clickable' : ''}`}>
      { canLogout && (<DownOutlined className='user-menu-down-icon'/>)}
      <span className='user-menu-name'>{user.name}</span>
      <img alt='Avatar' className='user-menu-avatar' src={userAvatar}/>
    </div>
  )
}

export const UserMenu: React.FC<UserMenuProps> = ({ canLogout, locale, user, onUserMenuClick }) => {
  return !canLogout
    ? (<UserInfo canLogout={canLogout} user={user}/>)
    : (
      <Dropdown
        getPopupContainer={menuDOMNode => menuDOMNode.parentElement as HTMLElement}
        overlay={
          <Menu
            className='user-menu-overlay-body'
            items={[{ key: 'logout', label: locale?.logout ?? 'Logout', title: locale?.logout ?? 'Logout' }]}
            onClick={onUserMenuClick}
          />
        }
        overlayClassName='user-menu-overlay'
        placement='bottom'
      >
        {/* As to ant version 4.23.5, this div is needed otherwise no Dropdown is mounted */}
        <div>
          <UserInfo canLogout={canLogout} user={user}/>
        </div>
      </Dropdown>
    )
}
