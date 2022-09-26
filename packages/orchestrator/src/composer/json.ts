import type { ArrayContent, Component, Content } from '@micro-lc/interfaces'

import { toArray } from '../utils/array'

function contentToArrayOfNodes(rawContent: ArrayContent | Component): ArrayContent {
  return Array.isArray(rawContent) ? rawContent : [rawContent]
}

function parseContent(buffer: string[], content: Content, extraProperties: string[]): void {
  if (typeof content !== 'object') {
    buffer.push(`${content}`)
    return
  }

  contentToArrayOfNodes(content).forEach((el) => {
    if (typeof el !== 'object') {
      buffer.push(`${el}`)
      return
    }

    const {
      tag,
      attributes = {},
      booleanAttributes = [],
      properties = {},
      content: nextContent,
    } = el
    const initialTagOpen = `<${tag}`
    const initialTagClose = `>`
    const finalTag = `</${tag}>`
    const initialTagAttributes = Object
      .entries(attributes)
      .reduce<string[]>((acc, [name, value]) => {
        acc.push(`${name}="${value}"`)
        return acc
      }, [])
    const initialTagBooleanAttributes = toArray(booleanAttributes)

    // separate extra properties for override
    const { override, props } = Object
      .entries(properties)
      .reduce<{override: Record<string, string | undefined>; props: Record<string, unknown>}>((acc, [key, value]) => {
        extraProperties.includes(key)
          ? (typeof value === 'string' && (acc.override[key] = value))
          : acc.props[key] = value
        return acc
      }, { override: {}, props: {} })

    // override if available
    const initialTagExtraProperties = extraProperties
      .map((prop) => `.${prop}=\${${override[prop] ?? prop}}`)

    // set regular props
    const initialTagProperties = Object
      .entries(props)
      .reduce<string[]>((acc, [name, value]) => {
        switch (typeof value) {
        case 'object':
        case 'number':
        case 'boolean':
          acc.push(`.${name}=\${${JSON.stringify(value)}}`)
          break
        case 'string':
          acc.push(`.${name}=\${"${value}"}`)
          break
        default:
          break
        }

        return acc
      }, [])

    buffer.push([
      initialTagOpen,
      initialTagAttributes.join(' '),
      initialTagBooleanAttributes.join(' '),
      initialTagExtraProperties.join(' '),
      initialTagProperties.join(' '),
      initialTagClose,
    ].join(' '))

    if (nextContent !== undefined) {
      parseContent(buffer, nextContent, extraProperties)
    }

    buffer.push(finalTag)
  })
}

export function jsonToHtml(content: Content, extraProperties: string[] = []): string {
  const buffer: string[] = []
  parseContent(buffer, content, extraProperties)

  return buffer.join(' ')
}
