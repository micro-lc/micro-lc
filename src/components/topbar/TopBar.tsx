import React, {useState} from 'react'
import {useIntl} from 'react-intl'

import './TopBar.module.css'

export interface TopBarProps {
  onBurgerClick?: (isToggled: boolean) => void
}

export const TopBar: React.FC<TopBarProps> = ({onBurgerClick}) => {
  const intl = useIntl()

  return (
    <>
      <BurgerIcon onBurgerClick={onBurgerClick}/>
      <span id="topbar-title">{intl.formatMessage({id: 'topBarTitle'})}</span>
    </>
  )
}

const BurgerIcon: React.FC<TopBarProps> = ({onBurgerClick}) => {
  const [isChecked, setChecked] = useState(false)

  const manageToggle = () => {
    const newCheckedState = !isChecked
    setChecked(newCheckedState)
    onBurgerClick?.(newCheckedState)
  }

  return (
    <label htmlFor="check" onClick={manageToggle}>
      <input checked={isChecked} id="topbar-side-menu-toggle" readOnly={true} type="checkbox"/>
      <span/>
      <span/>
      <span/>
    </label>
  )
}
