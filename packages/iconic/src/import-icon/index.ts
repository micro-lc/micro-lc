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
import type { IconDefinition as FontawesomeIconDefinition } from '@fortawesome/fontawesome-svg-core'

export type Library =
  | '@ant-design/icons-svg'
  | '@fortawesome/free-brands-svg-icons'
  | '@fortawesome/free-regular-svg-icons'
  | '@fortawesome/free-solid-svg-icons'
  | 'phosphor/bold'
  | 'phosphor/duotone'
  | 'phosphor/fill'
  | 'phosphor/light'
  | 'phosphor/regular'
  | 'phosphor/thin'

export type ResourceObject = string | { library: Library; src: string }

export type Resources = Record<Library, string>;

export interface IconComponent {
  attrs?: Record<string, unknown>
  children?: IconComponent | IconComponent[]
  key?: number
  tag: 'svg' | 'path' | 'rect' | 'circle'
}

export interface ChildComponent extends Omit<IconComponent, 'children'> {
  tag: 'path' | 'rect' | 'circle'
}

export interface SvgComponent extends IconComponent {
  children?: ChildComponent | ChildComponent[]
  tag: 'svg'
}

interface AntdIconDefaultImport {
  icon: IconComponent | ((primaryColor?: string, secondaryColor?: string) => IconComponent)
}

interface PhosphorDefaultImport {
  icon: IconComponent
}

interface FontAwesomeIconImport { default: { definition: FontawesomeIconDefinition } }

const resources: Resources = {
  '@ant-design/icons-svg': 'https://cdn.jsdelivr.net/npm/@ant-design/icons-svg@4.2.1/es/asn/',
  '@fortawesome/free-brands-svg-icons': 'https://cdn.jsdelivr.net/npm/@micro-lc/iconic@latest/dist/fab/',
  '@fortawesome/free-regular-svg-icons': 'https://cdn.jsdelivr.net/npm/@micro-lc/iconic@latest/dist/far/',
  '@fortawesome/free-solid-svg-icons': 'https://cdn.jsdelivr.net/npm/@micro-lc/iconic@latest/dist/fas/',
  'phosphor/bold': 'https://cdn.jsdelivr.net/npm/@micro-lc/iconic@latest/dist/ph/bold/',
  'phosphor/duotone': 'https://cdn.jsdelivr.net/npm/@micro-lc/iconic@latest/dist/ph/duotone/',
  'phosphor/fill': 'https://cdn.jsdelivr.net/npm/@micro-lc/iconic@latest/dist/ph/fill/',
  'phosphor/light': 'https://cdn.jsdelivr.net/npm/@micro-lc/iconic@latest/dist/ph/light/',
  'phosphor/regular': 'https://cdn.jsdelivr.net/npm/@micro-lc/iconic@latest/dist/ph/regular/',
  'phosphor/thin': 'https://cdn.jsdelivr.net/npm/@micro-lc/iconic@latest/dist/ph/thin/',
}

const resourceKeys = Object.keys(resources)

export function isResourceKey(input: unknown): input is Library {
  return typeof input === 'string' && resourceKeys.includes(input)
}

export function isResourceObject(input: unknown): input is Exclude<ResourceObject, string> {
  return typeof input === 'object'
    && typeof (input as Exclude<ResourceObject, string>).library === 'string'
    && typeof (input as Exclude<ResourceObject, string>).src === 'string'
}

export function toArray<T>(input: T | T[]): T[] {
  return Array.isArray(input) ? input : [input]
}

export async function importIcon(selector: string, resource: ResourceObject): Promise<IconComponent> {
  const library = typeof resource === 'string' ? resource : resource.library

  if (!isResourceKey(library)) {
    return Promise.reject(new TypeError(`${library} must be included in ${resourceKeys.join(', ')}`))
  }

  const url = typeof resource === 'string' ? resources[library] : resource.src
  const uri = `${url.replace(/\/$/, '')}/${selector.replace(/^\//, '').replace(/\.js$/, '')}.js`

  // SAFETY: library check is already enforced
  switch (library) {
  case '@ant-design/icons-svg':
    return import(/* @vite-ignore */ /* webpackIgnore: true */uri)
      .then(({ default: { icon } }: { default: AntdIconDefaultImport }) => icon)
      .then((icon) => (typeof icon === 'function' ? icon('currentColor', 'white') : icon))
  case '@fortawesome/free-brands-svg-icons':
  case '@fortawesome/free-regular-svg-icons':
  case '@fortawesome/free-solid-svg-icons':
    return import(/* @vite-ignore */ /* webpackIgnore: true */uri).then(({ default: { definition } }: FontAwesomeIconImport) => {
      const { icon: [width, height, _1, _2, paths] } = definition
      return {
        attrs: {
          'aria-hidden': true,
          viewBox: width && height && `0 0 ${width} ${height}`,
          xmlns: 'http://www.w3.org/2000/svg',
        },
        children: toArray(paths).map((svgPathData) => (
          {
            attrs: {
              d: svgPathData,
              fill: 'currentColor',
            },
            tag: 'path',
          }
        )),
        tag: 'svg',
      }
    })
  case 'phosphor/bold':
  case 'phosphor/duotone':
  case 'phosphor/fill':
  case 'phosphor/light':
  case 'phosphor/regular':
  case 'phosphor/thin':
    return import(/* @vite-ignore */ /* webpackIgnore: true */uri).then(({ default: { icon } }: {default: PhosphorDefaultImport}) => icon)
  }
}

