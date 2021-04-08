import React from 'react'
import classNames from 'classnames'
import {bool} from 'prop-types'

import './DropdownIcon.less'

type DropdownIconParams = {
  dropdownOpened: boolean
}

export const DropdownIcon: React.FC<DropdownIconParams> = ({dropdownOpened}) => {
  const iconClasses = classNames('fas', 'fa-chevron-down', 'dropdownIcon_icon', {opened: dropdownOpened})
  return (
    <i className={iconClasses}/>
  )
}

DropdownIcon.propTypes = {
  dropdownOpened: bool.isRequired
}
