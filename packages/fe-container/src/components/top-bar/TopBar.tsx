import React, {useContext} from 'react'

import {BurgerIcon} from '../burger-icon/BurgerIcon'
import {ConfigurationContext} from '../../contexts/Configuration.context'

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
    </div>
  )
}
