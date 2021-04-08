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
