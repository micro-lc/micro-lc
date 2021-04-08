import React, {useCallback, useState} from 'react'
import {Dropdown} from 'antd'
import {User} from '@mia-platform/core'

import './UserMenu.less'
import {DropdownIcon} from '@components/dropdown-icon/DropdownIcon'
import {UserMenuOverlay} from '@components/user-menu-overlay/UserMenuOverlay'

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
        <DropdownIcon dropdownOpened={dropdownOpened}/>
        <span className='userMenu_name'>{user.name}</span>
        <img alt='Avatar' className='userMenu_avatar' src={retrieveUserAvatar(user)}/>
      </div>
    </Dropdown>
  )
}
