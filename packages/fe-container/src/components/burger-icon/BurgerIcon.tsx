import React, {useContext, useState} from 'react'
import {MenuOpenedContext} from '../../contexts/MenuOpened.context'

export const BurgerIcon: React.FC = () => {
  const {isMenuOpened, setMenuOpened} = useContext(MenuOpenedContext)
  const [isChecked, setChecked] = useState(false)

  const manageToggle = () => {
    setChecked(!isChecked)
    setMenuOpened(!isMenuOpened)
  }

  return (
    <label htmlFor="check" onClick={manageToggle}>
      <input checked={isMenuOpened} data-testid="top-bar-side-menu-toggle" readOnly={true} type="checkbox"/>
      <span/>
      <span/>
      <span/>
    </label>
  )
}
