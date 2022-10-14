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

export function index(
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
