// Antd Header height is 64px
import React from 'react'

const menuHeight = window.innerHeight - 64

const style: {[key: string]: React.CSSProperties} = {
  menu: {
    height: `${menuHeight}px`,
    paddingTop: '24px',
    borderTop: '1px solid #d9d9d9'
  },
  divider: {
    width: '80%',
    minWidth: '80%',
    float: 'right',
    margin: 0
  }
}

export default style
