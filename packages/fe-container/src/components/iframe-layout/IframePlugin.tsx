import React, {useContext, useEffect, useState} from 'react'
import {Plugin} from '@mia-platform/core'

import {MenuOpenedContext} from '../../contexts/MenuOpened.context'

export const IframePlugin: React.FC<Plugin> = (plugin) => {
  const [iframeOver, setIframeOver] = useState(false)
  const {setMenuOpened} = useContext(MenuOpenedContext)

  useEffect(() => {
    const blurHandler = () => iframeOver && setMenuOpened(false)
    window.addEventListener('blur', blurHandler)
    return () => window.removeEventListener('blue', blurHandler)
  }, [iframeOver, setMenuOpened])

  return (
    <iframe
      className="layout-iframe" frameBorder="0"
      onMouseOut={() => setIframeOver(false)} onMouseOver={() => setIframeOver(true)}
      src={plugin.pluginUrl} title={plugin.id}
    />
  )
}
