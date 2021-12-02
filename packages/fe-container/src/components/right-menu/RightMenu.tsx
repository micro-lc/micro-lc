import {ConfigurationContext} from '@contexts/Configuration.context'
import {RightMenuItem} from '@mia-platform/core'
import React, {RefObject, useCallback, useContext} from 'react'

const itemMapper = (rightMenu: RightMenuItem, index: number) => <RightMenuItemComponent key={index} {...rightMenu}/>

export const RightMenu: React.VFC = () => {
  const configuration = useContext(ConfigurationContext)

  return (
    <>
      {configuration.rightMenu?.map(itemMapper)}
    </>
  )
}

const camelCase = (key: string) => key.replace(/-([a-z])/g, matched => matched[1].toUpperCase())

const styleConverter = (style: string = '') => style
  .split(';')
  .map((value: string) => value.trim())
  .filter(Boolean)
  .reduce((acc, currentElement) => {
    const [key, value] = currentElement.split(':')
    // @ts-ignore
    acc[camelCase(key)] = value.trim()
    return acc
  }, {})

const enrichNode = (domNode: any) => ([key, value]: [string, any]) => {
  domNode[key] = value
}

const createStyle = (attributes: any) => {
  const convertedStyle = styleConverter(attributes?.style)
  return {
    style: convertedStyle
  }
}

const RightMenuItemComponent: React.FC<RightMenuItem> = ({entry, tag, attributes = {}, properties = {}}) => {
  const onRefChange = useCallback((ref: RefObject<any>) => {
    const currentRef = ref?.current
    if (currentRef) {
      Object.entries(properties).forEach(enrichNode(currentRef))
    }
  }, [properties])

  const fallbackAttributes = attributes || {}

  return React.createElement(
    tag,
    {
      ref: onRefChange,
      ...fallbackAttributes,
      ...createStyle(attributes)
    }
  )
}
