import React from 'react'
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
  return (
    <label className="darkModeSwitch">
      <input type="checkbox"/>
      <span className="slider round"/>
    </label>
  )
}
