import React, {useContext, useState} from 'react'
import {FormattedMessage} from 'react-intl'
import {Dropdown} from 'antd'

import {MenuOpenedContext} from '../../contexts/MenuOpened.context'
import {SideMenu} from '../side-menu/SideMenu'
import {ConfigurationContext} from '../../contexts/Configuration.context'

import './TopBar.less'

export const TopBar: React.FC = () => {
  return (
    <div className="topBar_container">
      <BurgerIcon/>
      <span data-testid="top-bar-title">
        <FormattedMessage id="topBarTitle"/>
      </span>
    </div>
  )
}

const BurgerIcon: React.FC = () => {
  const {isMenuOpened, setMenuOpened} = useContext(MenuOpenedContext)
  const [isChecked, setChecked] = useState(false)

  const manageToggle = () => {
    setChecked(!isChecked)
    setMenuOpened(!isMenuOpened)
  }

  const configuration = useContext(ConfigurationContext)

  const sideMenu = <SideMenu plugins={configuration?.plugins}/>

  return (
    <Dropdown
      onVisibleChange={manageToggle} overlay={sideMenu} overlayClassName="sideMenu_overlay"
      trigger={['click']} visible={isMenuOpened}
    >
      <label htmlFor="check">
        <input checked={isMenuOpened} data-testid="top-bar-side-menu-toggle" readOnly={true} type="checkbox"/>
        <span/>
        <span/>
        <span/>
      </label>
    </Dropdown>
  )
}
