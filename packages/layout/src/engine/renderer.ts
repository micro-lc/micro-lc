import type { FunctionComponent } from 'react'
import React from 'react'
import ReactDOM from 'react-dom'

export interface LitCreatable<P = {children?: React.ReactNode}> {
  Component: FunctionComponent<P>
  container?: HTMLElement | null
  create?: () => P
  renderRoot: HTMLElement | ShadowRoot
}

export function unmount<P, T extends LitCreatable<P>>(this: T): boolean {
  const { container: thisContainer, renderRoot } = this

  let container = renderRoot
  if (thisContainer) { container = thisContainer }

  return ReactDOM.unmountComponentAtNode(container as HTMLElement)
}

export function reactRender<P extends Record<string, unknown>, T extends LitCreatable<P>>(
  this: T,
  conditionalRender = true,
  ...children: React.ReactNode[]
): P | undefined {
  const { Component, create, container: thisContainer, renderRoot } = this

  let container = renderRoot
  if (thisContainer) { container = thisContainer }

  const props = create?.call(this)

  if (props && conditionalRender) {
    ReactDOM.render(React.createElement(Component, { ...props }, ...children), container)
  }

  return props
}
