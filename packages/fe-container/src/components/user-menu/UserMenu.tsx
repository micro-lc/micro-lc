import React, {useContext} from 'react'
import {Dropdown, Menu} from 'antd'

import {UserContext} from '@contexts/User.context'

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
      <>
        <i className="fas fa-chevron-down"/>
        <span>{user.name}</span>
      </>
    </Dropdown>
  )
}
