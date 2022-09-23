import { expect, waitUntil } from '@open-wc/testing'
import { render, html } from 'lit-html'
import React, { createElement, Suspense } from 'react'
import type { Root } from 'react-dom/client'
import { createRoot } from 'react-dom/client'

import type { SVGProps } from '../src'
import { useIcon } from '../src'
import type { Library } from '../src/import-icon'

interface Props extends SVGProps {
  library: Library
  selector: string
  src?: string
}

function App({ selector, library, src, ref: _, ...props }: Props) {
  const Icon = useIcon(
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

describe('iconix react tests', () => {
  after(() => {
    for (const child of document.body.children) {
      child.remove()
    }
  })

  it('should render an antd icon', async () => {
    const [container, root] = createReactApp(document, {
      library: '@ant-design/icons-svg',
      selector: 'AccountBookFilled',
    })

    await waitUntil(() => container.querySelectorAll('svg').length >= 1)
    expect(container.querySelector('svg')).to.have.attribute('viewBox')
    expect(container.querySelector('path')).to.have.attribute('d')

    root.unmount()
  })

  it('should fail fetching an icon and keep the fallback JSX', async () => {
    const [container, root] = createReactApp(document, {
      library: '@ant-design/icons-svg',
      selector: 'MessageOutlined_',
    })

    await waitUntil(() => container.querySelectorAll('svg').length >= 1, `
      no div here:
        ${container.outerHTML}
    `)
    expect(container.querySelector('svg')).to.have.property('textContent', '')

    root.unmount()
  })
})

describe('iconix web-component tests', () => {
  it('should render an antd icon', async () => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    render(html`
      <mlc-iconix
        selector="MessageOutlined"
        library="@ant-design/icons-svg"
      ></mlc-iconix>
    `, container)

    const mlcIconix: HTMLElement & {
      readonly updateComplete: boolean
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    } = container.querySelector('mlc-iconix')!

    await waitUntil(() => mlcIconix.updateComplete)

    expect(container.querySelector('svg')).to.have.attribute('viewBox')
    expect(container.querySelector('path')).to.have.attribute('d')
  })

  it('should fail fetching an icon and keep the fallback', async () => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    render(html`
      <mlc-iconix
        selector="MessageOutlined_"
        library="@ant-design/icons-svg"
      ></mlc-iconix>
    `, container)

    const mlcIconix: HTMLElement & {
      readonly updateComplete: boolean
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    } = container.querySelector('mlc-iconix')!

    await waitUntil(() => mlcIconix.updateComplete)

    expect(container.querySelector('svg')).to.have.property('textContent', '')
  })

  it('should show a fontawesome solid icon', async () => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    render(html`
      <mlc-iconix
        selector="faTrash"
        library="@fortawesome/free-solid-svg-icons"
        src="/dist/fas/"
      ></mlc-iconix>
    `, container)

    const mlcIconix: HTMLElement & {
      readonly updateComplete: boolean
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    } = container.querySelector('mlc-iconix')!

    await waitUntil(() => mlcIconix.updateComplete)

    expect(container.querySelector('svg')).to.have.attribute('viewBox')
    expect(container.querySelector('path')).to.have.attribute('d')
  })

  it('should show a fontawesome regular icon', async () => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    render(html`
      <mlc-iconix
        selector="faAddressBook"
        library="@fortawesome/free-regular-svg-icons"
        src="/dist/far/"
      ></mlc-iconix>
    `, container)

    const mlcIconix: HTMLElement & {
      readonly updateComplete: boolean
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    } = container.querySelector('mlc-iconix')!

    await waitUntil(() => mlcIconix.updateComplete)

    expect(container.querySelector('svg')).to.have.attribute('viewBox')
    expect(container.querySelector('path')).to.have.attribute('d')
  })
})
