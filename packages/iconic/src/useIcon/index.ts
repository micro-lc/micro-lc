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
import { createElement, forwardRef, lazy } from 'react'
import type {
  SVGProps as ReactSVGProps,
  ForwardedRef,
  Key,
  ReactElement,
  RefAttributes,
  ForwardRefExoticComponent,
  LazyExoticComponent,
  PropsWithoutRef,
} from 'react'

import { importIcon, toArray } from '../import-icon'
import type { ResourceObject, PathComponent, SvgComponent } from '../import-icon'

export type SVGProps = ReactSVGProps<HTMLElement>

function iconPathCompose({ attrs }: PathComponent, { key, ref }: PropsWithoutRef<{key: Key}> & RefAttributes<Element>) {
  return createElement('path', { ...attrs, key, ref })
}

function iconSvgCompose({ attrs, children = [] }: SvgComponent, { ref, ...props }: SVGProps & RefAttributes<Element>): ReactElement {
  return createElement('svg', { ...attrs, ...props, ref }, ...toArray(children).map((path, key) => iconPathCompose(path, { key })))
}

export function useIcon(
  selector: string, resource: ResourceObject, errorHandler?: (msg: string) => void
): LazyExoticComponent<ForwardRefExoticComponent<SVGProps & RefAttributes<HTMLElement>>> {
  const defaultReturnValue = { default: forwardRef((props: SVGProps, ref: ForwardedRef<HTMLElement>) => createElement('svg', { props, ref })) }
  return lazy(() => importIcon(selector, resource)
    .then((icon) => (
      { default: forwardRef((props: SVGProps, ref: ForwardedRef<HTMLElement>) => iconSvgCompose(icon as SvgComponent, { ...props, ref })) }
    ))
    .catch((err: TypeError) => {
      errorHandler?.(err.message)
      return defaultReturnValue
    }))
}
