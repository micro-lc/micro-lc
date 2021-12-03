import {ConfigurationContext} from '@contexts/Configuration.context'
import {RightMenuItem} from '@mia-platform/core'
import React, {RefObject, useCallback, useContext} from 'react'
import {Helmet} from 'react-helmet'

import './TopRightSection.less'

const itemMapper = (sharedProps: any) =>
  function mapper (rightMenu: RightMenuItem, index: number) {
    return <RightMenuItemComponent key={index} shared={sharedProps} {...rightMenu}/>
  }

export const TopRightSection: React.VFC = () => {
  const configuration = useContext(ConfigurationContext)

  return (
    <>
      {configuration.rightMenu?.map(itemMapper(configuration.shared))}
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

type RightMenuItemAdditionalProps = {
  shared: any
}

const RightMenuItemComponent: React.FC<RightMenuItem & RightMenuItemAdditionalProps> = ({entry, tag, attributes = {}, properties = {}, shared = {}}) => {
  const onRefChange = useCallback((ref: RefObject<any>) => {
    const domNode = ref && document.querySelector(tag)
    if (domNode) {
      const domNodeEnricher = enrichNode(domNode)
      Object.entries(shared).forEach(domNodeEnricher)
      Object.entries(properties).forEach(domNodeEnricher)
    }
  }, [properties, tag, shared])

  const fallbackAttributes = attributes || {}

  const scriptType = entry.includes('esm') ? 'module' : undefined

  return (
    <div className='micro-lc-wc-container'>
      <Helmet>
        <script src={entry} type={scriptType} />
      </Helmet>
      {
        React.createElement(
          tag,
          {
            ref: onRefChange,
            ...fallbackAttributes,
            ...createStyle(attributes)
          }
        )
      }
    </div>
  )
}
