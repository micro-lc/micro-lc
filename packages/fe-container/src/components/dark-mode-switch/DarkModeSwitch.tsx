import React, {useCallback, useState} from 'react'
import {FormattedMessage} from 'react-intl'

import {switchTheme} from '@utils/theme/ThemeManager'

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
  const [toggleChecked, isToggleChecked] = useState(false)
  const toggleHandler = useCallback(() => {
    isToggleChecked((oldValue) => !oldValue)
    switchTheme()
  }, [])

  return (
    <label className="darkModeSwitch">
      <input checked={toggleChecked} data-testid='dark-theme-toggle' onChange={toggleHandler} type="checkbox"/>
      <span className="slider round"/>
    </label>
  )
}
