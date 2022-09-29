import { createElement, lazy } from 'react'
import type {
  FunctionComponent,
  SVGProps as ReactSVGProps,
  LazyExoticComponent,
  DOMElement,
} from 'react'

import importIcon, { toArray } from './import-icon'
import type { IconComponent, ResourceObject } from './import-icon'

export type SVGProps = ReactSVGProps<HTMLElement>

function iconCompose({ tag, attrs, children, key }: IconComponent, props?: SVGProps): DOMElement<SVGProps, HTMLElement> {
  return createElement(tag, { ...attrs, ...props, key }, toArray(children).map((el, idx) => el && iconCompose({ ...el, key: idx })))
}

export function useIcon(
  selector: string, resource: ResourceObject, errorHandler?: (msg: string) => void
): LazyExoticComponent<FunctionComponent<SVGProps>> {
  const defaultReturnValue = { default: (props: SVGProps) => createElement('svg', props) }
  return lazy(() => importIcon(selector, resource)
    .then((icon) => (
      { default: (props: SVGProps) => iconCompose(icon, props) }
    ))
    .catch((err: TypeError) => {
      errorHandler?.(err.message)
      return defaultReturnValue
    }))
}
