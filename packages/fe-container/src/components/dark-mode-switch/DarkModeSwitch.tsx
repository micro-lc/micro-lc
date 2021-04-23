import React, {useCallback, useState} from 'react'
import {FormattedMessage} from 'react-intl'

import './DarkModeSwitch.less'
import {switchTheme} from '@utils/theme/ThemeManager'

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
      <input checked={toggleChecked} onChange={toggleHandler} type="checkbox"/>
      <span className="slider round"/>
    </label>
  )
}
