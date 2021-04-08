import React, {useCallback} from 'react'
import {Menu} from 'antd'
import {FormattedMessage} from 'react-intl'

import {logOutUser} from '@services/microlc/user.service'

export const UserMenuOverlay: React.FC = () => {
  const logOut = useCallback(() => {
    logOutUser().subscribe(() => window.location.reload())
  }, [])
  return (
    <Menu>
      <Menu.Item className='userMenu_entry'>
        <span className='userMenu_logout' onClick={logOut}>
          <FormattedMessage id='logout'/>
        </span>
      </Menu.Item>
    </Menu>
  )
}
