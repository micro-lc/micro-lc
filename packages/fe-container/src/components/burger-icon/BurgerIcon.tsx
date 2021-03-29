import React, {useContext} from 'react'

import {MenuOpenedContext} from '@contexts/MenuOpened.context'

import './BurgerIcon.less'

export const BurgerIcon: React.FC = () => {
  const {isMenuOpened, setMenuOpened} = useContext(MenuOpenedContext)

  const manageToggle = () => {
    setMenuOpened(!isMenuOpened)
  }

  return (
    <label
      className='burgerIcon_container'
      htmlFor='check'
      onClick={manageToggle}
    >
      <input
        checked={isMenuOpened}
        data-testid='top-bar-side-menu-toggle'
        readOnly={true}
        type='checkbox'
      />
      <span/>
      <span/>
      <span/>
    </label>
  )
}
