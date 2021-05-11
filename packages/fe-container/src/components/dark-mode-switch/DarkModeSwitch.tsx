import React, {useCallback, useEffect, useState} from 'react'
import {FormattedMessage} from 'react-intl'
import PropTypes from 'prop-types'

import {switchTheme} from '@utils/theme/ThemeManager'
import {isDarkModeSet, toggleDarkModeSettings} from '@utils/settings/dark-mode/DarkModeSettings'

import './DarkModeSwitch.less'

const switchProps = {
  toggleCallback: PropTypes.func
}

type SwitchProps = PropTypes.InferProps<typeof switchProps>
export const DarkModeSwitch: React.FC<SwitchProps> = ({toggleCallback}) => {
  return (
    <>
      <FormattedMessage id='light'/>
      <Switch toggleCallback={toggleCallback}/>
      <FormattedMessage id='dark'/>
    </>
  )
}

const Switch: React.FC<SwitchProps> = ({toggleCallback}) => {
  const [toggleChecked, isToggleChecked] = useState(isDarkModeSet())

  const themeHandler = useCallback(() => {
    toggleCallback?.()
    switchTheme()
  }, [toggleCallback])

  const toggleHandler = useCallback(() => {
    isToggleChecked((oldValue) => !oldValue)
    toggleDarkModeSettings()
    themeHandler()
  }, [themeHandler])

  useEffect(() => {
    if (toggleChecked) themeHandler()
    // eslint-disable-next-line
  }, [])

  return (
    <label className="darkModeSwitch">
      <input checked={toggleChecked} data-testid='dark-theme-toggle' onChange={toggleHandler} type="checkbox"/>
      <span className="slider round"/>
    </label>
  )
}

DarkModeSwitch.propTypes = switchProps
Switch.propTypes = switchProps
