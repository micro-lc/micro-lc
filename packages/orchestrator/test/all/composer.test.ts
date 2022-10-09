import { createComposerContext, premount } from '@micro-lc/composer'
import type { PluginConfiguration } from '@micro-lc/interfaces/v2'
import { expect } from '@open-wc/testing'
import { createSandbox } from 'sinon'

import type { SchemaOptions } from '../../src/utils/json'
import type { BaseExtension, MicrolcApi } from '../../src/web-component'

interface BootstapProps {
  config: string | PluginConfiguration | undefined
  microlcApi?: Partial<MicrolcApi<BaseExtension>>
  name: string
  schema?: SchemaOptions | undefined
  version?: 1 | 2
}

interface MountProps {
  container: HTMLElement
  microlcApi?: Partial<MicrolcApi<BaseExtension>>
  name: string
}

interface MicroApp {
  bootstrap(props: BootstapProps): Promise<null>
  mount(props: MountProps): Promise<null>
  unmount(props: {name: string}): Promise<null>
  update(): Promise<null>
}

declare global {
  interface Window {
    __MICRO_LC_COMPOSER?: Partial<MicroApp>
  }
}

const now = new Date()
const config: PluginConfiguration = {
  content: {
    attributes: {
      id: 'root',
    },
    booleanAttributes: 'hidden',
    content: [
      0,
      {
        attributes: {
          style: 'display: flex;',
        },
        content: '1',
        tag: 'li',
      },
      {
        content: '2',
        tag: 'li',
      },
      {
        content: '3',
        properties: {
          array: {},
          date: now,
          fn() { return 0 },
          isodate: now.toISOString(),
        },
        tag: 'li',
      },
    ],
    properties: {
      'extra-property': 'extra-property.[0]',
    },
    tag: 'div',
  },
  sources: {
    importmap: { imports: {}, scopes: {} },
    uris: ['https://www.google.com'],
  },
}

type WindowCtx = Window & typeof globalThis

const define = (window: WindowCtx, name: keyof WindowCtx, value: unknown) => {
  const originalValue = window[name] as unknown
  Object.defineProperty(window, name, { value, writable: true })

  return () => Object.defineProperty(window, name, { value: originalValue, writable: true })
}

describe('composer api tests', () => {
  it(`should create a configuration mirror inside a given element;
      premount must append importmaps when requested and uris must be fetch;
      on createComposerContext properties and elements are appended`, async () => {
    const sandbox = createSandbox()
    const addImportMap = sandbox.stub()
    const importShim = sandbox.stub<
      [string], Promise<{default: unknown} & object>
    >().callsFake((url) => {
      const { href } = new URL(url, window.location.origin)
      return href === 'https://www.google.com/'
        ? Promise.resolve({ default: {} })
        : Promise.reject(new TypeError('expecting google.com'))
    })
    Object.defineProperty(importShim, 'addImportMap', { value: addImportMap })

    const removeImportShim = define(window, 'importShim', importShim)


    const resolvedConfig = await premount(config)
    expect(addImportMap).to.be.calledOnce
    expect(importShim).to.be.calledOnceWith('https://www.google.com')
    expect(resolvedConfig).to.eql(config)

    const appender = await createComposerContext(
      resolvedConfig.content, {
        context: { 'extra-property': [1] },
        extraProperties: ['extra-property'],
      }
    )
    const container = document.createElement('div')
    appender(container)

    expect(container).dom.to.equal(`
      <div>
        <div id="root" hidden="">
          0
          <li style="display: flex;">1</li>
          <li>2</li>
          <li>3</li>
        </div>
      </div>
    `)
    expect(container.firstElementChild).to.have.property('extra-property', 1)
    expect(container.querySelector('#root :nth-child(1)')).to.have.attribute('style', 'display: flex;')
    expect(container.querySelector('#root :nth-child(3)')).to.have.property('array')
    expect(container.querySelector('#root :nth-child(3)')).to.have.property('date', now.toISOString())
    expect(container.querySelector('#root :nth-child(3)')).not.to.have.property('fn')
    expect(container.querySelector('#root :nth-child(3)')).to.have.property('isodate', now.toISOString())

    removeImportShim()
    sandbox.restore()
  })
})

describe('composer plugin tests', () => {
  it('check eventBus pool discrimination', async () => {
    const sandbox = createSandbox()

    const container = document.createElement('div')
    const microlcApi = {}
    expect(window.__MICRO_LC_COMPOSER).to.have.property('bootstrap')

    const api = {
      composerApi: { createComposerContext, premount },
      config: {
        content: [
          {
            properties: { eventBus: 'eventBus.[0]' },
            tag: 'div',
          },
          { tag: 'div' },
          { tag: 'div' },
        ],
      },
      microlcApi,
      name: 'composable-app',
      schema: {},
    }

    await window.__MICRO_LC_COMPOSER?.bootstrap?.(api)

    await window.__MICRO_LC_COMPOSER?.mount?.({
      container,
      ...api,
    })

    interface ComposedDiv extends HTMLDivElement {
      eventBus: unknown
    }

    const [div1, div2, div3] = container.querySelectorAll('div') as NodeListOf<ComposedDiv>
    expect(div2.eventBus).to.equal(div3.eventBus)
    expect(div1.eventBus).not.to.equal(div3.eventBus)

    sandbox.restore()
  })
})
