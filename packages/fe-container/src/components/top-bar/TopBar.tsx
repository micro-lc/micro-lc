import React from 'react'
import {FormattedMessage} from 'react-intl'

import './TopBar.less'
import {BurgerIcon} from '../burger-icon/BurgerIcon'

export const TopBar: React.FC = () => {
  return (
    <div className="topBar_container">
      <BurgerIcon/>
      <span data-testid="top-bar-title">
        <FormattedMessage id="topBarTitle"/>
      </span>
    </div>
  )
}
