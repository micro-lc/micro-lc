import React, {useCallback} from 'react'
import {FormattedMessage} from 'react-intl'

import './DarkModeSwitch.less'

export const DarkModeSwitch: React.FC = () => {
  return (
    <>
      <FormattedMessage id='light'/>
      <Switch/>
      <FormattedMessage id='dark'/>
    </>
  )
}

const Switch: React.FC = () => {
  const toggleHandler = useCallback(() => {
    document.body.classList.toggle('dark_theme')
  }, [])

  return (
    <label className="darkModeSwitch">
      <input onClick={toggleHandler} type="checkbox"/>
      <span className="slider round"/>
    </label>
  )
}
