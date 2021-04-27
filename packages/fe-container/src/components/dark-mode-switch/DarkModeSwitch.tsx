import React, {useCallback, useState} from 'react'
import {FormattedMessage} from 'react-intl'
import PropTypes from 'prop-types'

import {switchTheme} from '@utils/theme/ThemeManager'

import './DarkModeSwitch.less'

const darkModeSwitchProps = {
  toggleCallback: PropTypes.func.isRequired
}

type DarkModeSwitchProps = PropTypes.InferProps<typeof darkModeSwitchProps>
export const DarkModeSwitch: React.FC<DarkModeSwitchProps> = ({toggleCallback}) => {
  return (
    <>
      <FormattedMessage id='light'/>
      <Switch toggleCallback={toggleCallback}/>
      <FormattedMessage id='dark'/>
    </>
  )
}

const Switch: React.FC<DarkModeSwitchProps> = ({toggleCallback}) => {
  const [toggleChecked, isToggleChecked] = useState(false)
  const toggleHandler = useCallback(() => {
    isToggleChecked((oldValue) => !oldValue)
    toggleCallback()
    switchTheme()
  }, [toggleCallback])

  return (
    <label className="darkModeSwitch">
      <input checked={toggleChecked} data-testid='dark-theme-toggle' onChange={toggleHandler} type="checkbox"/>
      <span className="slider round"/>
    </label>
  )
}

DarkModeSwitch.propTypes = darkModeSwitchProps
Switch.propTypes = darkModeSwitchProps
