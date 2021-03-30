import React, {useContext} from 'react'

import {BurgerIcon} from '@components/burger-icon/BurgerIcon'
import {ConfigurationContext} from '@contexts/Configuration.context'
import {UserMenu} from '@components/user-menu/UserMenu'

import './TopBar.less'

export const TopBar: React.FC = () => {
  const configuration = useContext(ConfigurationContext)

  return (
    <div className='topBar_container'>
      <BurgerIcon/>
      <img
        alt={configuration?.theming?.logo.alt || 'Logo'}
        className='logo'
        data-testid='company-logo'
        src={configuration?.theming?.logo.url}
      />
      <div className='topBar_userMenu'>
        <UserMenu/>
      </div>
    </div>
  )
}
