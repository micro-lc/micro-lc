import React, {useContext, useState} from 'react'
import {FormattedMessage} from 'react-intl'

import './TopBar.less'
import {MenuOpenedContext} from '../../contexts/MenuOpened.context'

export const TopBar: React.FC = () => {
  return (
    <div className="container">
      <BurgerIcon/>
      <span data-testid="topbar-title">
        <FormattedMessage id="topBarTitle"/>
      </span>
    </div>
  )
}

const BurgerIcon: React.FC = () => {
  const {isMenuOpened, setMenuOpened} = useContext(MenuOpenedContext)
  const [isChecked, setChecked] = useState(false)

  const manageToggle = () => {
    setChecked(!isChecked)
    setMenuOpened(!isMenuOpened)
  }

  return (
    <label htmlFor="check" onClick={manageToggle}>
      <input checked={isMenuOpened} data-testid="topbar-side-menu-toggle" readOnly={true} type="checkbox"/>
      <span/>
      <span/>
      <span/>
    </label>
  )
}
