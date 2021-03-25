import React, {useContext} from 'react'

import './TopBar.less'
import {BurgerIcon} from '../burger-icon/BurgerIcon'
import {ConfigurationContext} from '../../contexts/Configuration.context'

export const TopBar: React.FC = () => {
  const configuration = useContext(ConfigurationContext)

  return (
    <div className="topBar_container">
      <BurgerIcon/>
      <img className="logo" data-testid="company-logo" src={configuration?.theming?.logo}/>
    </div>
  )
}
