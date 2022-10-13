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
