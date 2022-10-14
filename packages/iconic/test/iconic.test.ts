import { expect, waitUntil } from '@open-wc/testing'
import React, { createElement, Suspense } from 'react'
import type { Root } from 'react-dom/client'
import { createRoot } from 'react-dom/client'

import type { SVGProps } from '../src'
import { index } from '../src'
import type { Library } from '../src/import-icon/import-icon'

interface Props extends SVGProps {
  library: Library
  selector: string
  src?: string
}

function App({ selector, library, src, ref: _, ...props }: Props) {
  const Icon = index(
    selector,
    src ? { library, src } : library,
    console.error
  )
  return createElement(
    Suspense,
    { fallback: React.createElement('div', undefined, 'Loading...') },
    createElement(Icon, props)
  )
}

const createReactApp = (document: Document, props: Props): [HTMLElement, Root] => {
  const id = window.crypto.randomUUID()
  const container = document.createElement('div')
  container.setAttribute('id', id)
  document.body.appendChild(container)

  const root = createRoot(container)
  root.render(createElement(App, props))
  return [container, root]
}

describe('iconic react tests', () => {
  it('should render an antd icon', async () => {
    const [container, root] = createReactApp(document, {
      library: '@ant-design/icons-svg',
      selector: 'AccountBookFilled',
    })

    await waitUntil(() => container.querySelectorAll('svg').length >= 1)
    expect(container.querySelector('svg')).to.have.attribute('viewBox')
    expect(container.querySelector('path')).to.have.attribute('d')

    root.unmount()
    container.remove()
  })

  it('should fail fetching an icon and keep the fallback JSX', async () => {
    const [container, root] = createReactApp(document, {
      library: '@ant-design/icons-svg',
      selector: 'MessageOutlined_',
    })

    await waitUntil(() => container.querySelectorAll('svg').length >= 1, `
      no div here:
        ${container.outerHTML}
    `, { timeout: 10000 })
    expect(container.querySelector('svg')).to.have.property('textContent', '')

    root.unmount()
    container.remove()
  })
})
