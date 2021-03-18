import React, {useState} from 'react'
import {FormattedMessage} from 'react-intl'
import PropTypes from 'prop-types'

import './TopBar.module.css'

const topBarProps = {
  burgerState: PropTypes.array.isRequired
}

type TopBarProps = PropTypes.InferProps<typeof topBarProps>

export const TopBar: React.FC<TopBarProps> = ({burgerState}) => {
  return (
    <>
      <BurgerIcon burgerState={burgerState}/>
      <span data-testid="topbar-title">
        <FormattedMessage id="topBarTitle"/>
      </span>
    </>
  )
}

TopBar.propTypes = topBarProps

const BurgerIcon: React.FC<TopBarProps> = ({burgerState: [isOpened, setOpened]}) => {
  const [isChecked, setChecked] = useState(false)

  const manageToggle = () => {
    setChecked(!isChecked)
    setOpened(!isChecked)
  }

  return (
    <label htmlFor="check" onClick={manageToggle}>
      <input checked={isOpened} data-testid="topbar-side-menu-toggle" readOnly={true} type="checkbox"/>
      <span/>
      <span/>
      <span/>
    </label>
  )
}

BurgerIcon.propTypes = topBarProps
