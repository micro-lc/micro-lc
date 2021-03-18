import React, {useState} from 'react'
import {useIntl} from 'react-intl'
import PropTypes from 'prop-types'

import './TopBar.module.css'

const topBarProps = {
  onBurgerClick: PropTypes.func
}

type TopBarProps = PropTypes.InferProps<typeof topBarProps>

export const TopBar: React.FC<TopBarProps> = ({onBurgerClick}) => {
  const intl = useIntl()

  return (
    <>
      <BurgerIcon onBurgerClick={onBurgerClick}/>
      <span data-testid="topbar-title">{intl.formatMessage({id: 'topBarTitle'})}</span>
    </>
  )
}

TopBar.propTypes = topBarProps

const BurgerIcon: React.FC<TopBarProps> = ({onBurgerClick}) => {
  const [isChecked, setChecked] = useState(false)

  const manageToggle = () => {
    const newCheckedState = !isChecked
    setChecked(newCheckedState)
    onBurgerClick?.(newCheckedState)
  }

  return (
    <label htmlFor="check" onClick={manageToggle}>
      <input checked={isChecked} data-testid="topbar-side-menu-toggle" readOnly={true} type="checkbox"/>
      <span/>
      <span/>
      <span/>
    </label>
  )
}

BurgerIcon.propTypes = topBarProps
