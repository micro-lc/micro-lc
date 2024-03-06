/**
  Copyright 2022 Mia srl

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
import type { ArrayContent, Component, Content, VoidComponent } from '@micro-lc/interfaces/v2'

import { toArray } from './to-array.js'

const voidTags = [
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]

function isVoidTag(content: Component | VoidComponent): content is VoidComponent {
  return voidTags.includes(content.tag)
}

function contentToArrayOfNodes(rawContent: ArrayContent | Component): ArrayContent {
  return Array.isArray(rawContent) ? rawContent : [rawContent]
}

function parseContent(buffer: string[], content: Content, extraProperties: Set<string>): void {
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
      // content: nextContent,
    } = el

    const isVoid = isVoidTag(el)

    const initialTagOpen = `<${tag}`
    const initialTagClose = isVoid ? '/>' : '>'
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
      .reduce<{ override: Record<string, string | undefined>; props: Record<string, unknown> }>((acc, [key, value]) => {
        extraProperties.has(key)
          ? (typeof value === 'string' && (acc.override[key] = value))
          : acc.props[key] = value
        return acc
      }, { override: {}, props: {} })

    // override if available
    const initialTagExtraProperties = Array.from(extraProperties.keys())
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

    if (!isVoid) {
      const { content: nextContent } = el
      nextContent !== undefined && parseContent(buffer, nextContent, extraProperties)

      buffer.push(finalTag)
    }
  })
}

export function jsonToHtml(content: Content, extraProperties = new Set<string>()): string {
  const buffer: string[] = []
  parseContent(buffer, content, extraProperties)

  return buffer.join(' ')
}
