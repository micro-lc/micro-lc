import type { ArrayContent, Component, Content } from '@micro-lc/interfaces'

import { toArray } from '../utils/array'

function contentToArrayOfNodes(rawContent: ArrayContent | Component): ArrayContent {
  return Array.isArray(rawContent) ? rawContent : [rawContent]
}

function parseContent(content: Content, buffer: string[]): void {
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
    const initialTagProperties = Object
      .entries(properties)
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
      initialTagProperties.join(' '),
      initialTagClose,
    ].join(' '))

    if (nextContent) {
      parseContent(nextContent, buffer)
    }

    buffer.push(finalTag)
  })
}

export function jsonToHtml(content: Content): string {
  const buffer: string[] = []
  parseContent(content, buffer)

  return buffer.join(' ')
}
