import { DownOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Dropdown, Menu } from 'antd'
import React, { useMemo } from 'react'

import type { Translations } from '../../lang'
import type { User } from '../../mlc-layout/lib/types'

export interface UserMenuProps {
  locale: Translations['MLC-LAYOUT'] | undefined
  onUserMenuClick: MenuProps['onClick'] | undefined
  user: User
}

export const UserMenu: React.FC<UserMenuProps> = ({ locale, user, onUserMenuClick }) => {
  const userAvatar = useMemo(() => {
    const fallbackUrl = `https://eu.ui-avatars.com/api/?name=${user.name ?? ''}&size=24x24`
    return user.avatar ?? fallbackUrl
  }, [user])

  return (
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
      <div className='user-menu-container'>
        <DownOutlined/>
        <span className='user-menu-name'>{user.name}</span>
        <img alt='Avatar' className='user-menu-avatar' src={userAvatar}/>
      </div>
    </Dropdown>
  )
}
