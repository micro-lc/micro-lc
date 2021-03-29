import React, {useContext} from 'react'
import {Dropdown, Menu} from 'antd'
import {User} from '@mia-platform/core'

import {UserContext} from '@contexts/User.context'

import './UserMenu.less'

const retrieveUserAvatar = (user: Partial<User>) => {
  const fallbackUrl = `https://eu.ui-avatars.com/api/?name=${user.name || ''}&size=24x24`
  return user.avatar || fallbackUrl
}

export const UserMenu: React.FC = () => {
  const user = useContext(UserContext)

  const overlayMenu = (
    <Menu>
      <Menu.Item>
        <button>{'ciao'}</button>
      </Menu.Item>
    </Menu>
  )

  return (
    <Dropdown overlay={overlayMenu}>
      <div className="userMenu_container">
        <i className='fas fa-chevron-down userMenu_icon'/>
        <span className='userMenu_name'>{user.name}</span>
        <img alt='Avatar' className='userMenu_avatar' src={retrieveUserAvatar(user)}/>
      </div>
    </Dropdown>
  )
}
