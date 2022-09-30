import type { FunctionComponent } from 'react'
import React from 'react'
import type { Root } from 'react-dom/client'
import { createRoot } from 'react-dom/client'

export interface LitCreatable<P = {children?: React.ReactNode}> {
  Component: FunctionComponent<P>
  container?: HTMLElement | null
  create?: () => P
  renderRoot: HTMLElement | ShadowRoot
  root?: Root
}

export function createReactRoot<P, T extends LitCreatable<P>>(this: T): void {
  if (this.container) {
    this.root = createRoot(this.container)
  }
}

export function unmount<P, T extends LitCreatable<P>>(this: T): void {
  this.root?.unmount()
}

export function reactRender<P extends Record<string, unknown>, T extends LitCreatable<P>>(
  this: T,
  conditionalRender = true,
  ...children: React.ReactNode[]
): P | undefined {
  const { Component, create, root } = this

  const props = create?.call(this)

  if (root && props && conditionalRender) {
    root.render(React.createElement(Component, { ...props }, ...children))
  }

  return props
}
