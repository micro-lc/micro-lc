import React, {useState} from 'react'
import {useIntl} from 'react-intl'
import {Button} from 'antd'

import {MenuFoldOutlined, MenuUnfoldOutlined} from '@ant-design/icons'

export interface TopBarProps {
  onBurgerClick?: (isToggled: boolean) => void
}

export const TopBar: React.FC<TopBarProps> = ({onBurgerClick}) => {
  const intl = useIntl()

  const [isToggled, setToggled] = useState(false)

  const manageToggle = () => {
    const newToggledState = !isToggled
    setToggled(newToggledState)
    onBurgerClick?.(newToggledState)
  }

  return (
    <>
      <Button id="topbar-side-menu-toggle" onClick={manageToggle} style={{marginBottom: 16}} type="primary">
        {isToggled ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
      </Button>
      <span id="topbar-title">{intl.formatMessage({id: 'topBarTitle'})}</span>
    </>
  )
}
