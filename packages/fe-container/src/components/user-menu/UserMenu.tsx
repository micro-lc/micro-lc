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
import React, {useCallback, useState} from 'react'
import {Dropdown} from 'antd'
import {User} from '@mia-platform/core'
import PropTypes from 'prop-types'

import {DropdownIcon} from '@components/dropdown-icon/DropdownIcon'
import {UserMenuOverlay} from '@components/user-menu-overlay/UserMenuOverlay'

import './UserMenu.less'

const retrieveUserAvatar = (user: Partial<User>) => {
  const fallbackUrl = `https://eu.ui-avatars.com/api/?name=${user.name || ''}&size=24x24`
  return user.avatar || fallbackUrl
}

export const UserMenu: React.FC<Partial<User>> = (user) => {
  const [dropdownOpened, setDropdownOpened] = useState<boolean>(false)
  const dropdownChanged = useCallback(() => {
    setDropdownOpened((wasOpened) => !wasOpened)
  }, [setDropdownOpened])

  return (
    <Dropdown
      onVisibleChange={dropdownChanged}
      overlay={<UserMenuOverlay/>}
      placement='bottomCenter'
      trigger={['click']}
    >
      <div className='userMenu_container' data-testid='userMenu_container'>
        <UserMenuContent dropdownOpened={dropdownOpened} user={user}/>
      </div>
    </Dropdown>
  )
}

type UserMenuContentProps = {
  dropdownOpened: boolean,
  user: Partial<User>
}

const UserMenuContent: React.FC<UserMenuContentProps> = ({user, dropdownOpened}) => {
  return (
    <>
      <DropdownIcon dropdownOpened={dropdownOpened}/>
      <span className='userMenu_name'>{user.name}</span>
      <img alt='Avatar' className='userMenu_avatar' src={retrieveUserAvatar(user)}/>
    </>
  )
}

UserMenuContent.propTypes = {
  dropdownOpened: PropTypes.bool.isRequired,
  user: PropTypes.any.isRequired
}
