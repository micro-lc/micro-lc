import { expect, use } from 'chai'
import type { MicroApp } from 'qiankun'
import { stub } from 'sinon'
import sinonChai from 'sinon-chai'

import type { ComposableApplicationProperties } from '../web-component'

use(sinonChai)

describe('composer plugin tests', () => {
  before(async () => {
    // unit test don't have a window
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    global.window || Object.defineProperty(global, 'window', { configurable: true, value: {}, writable: true })
    await import('../plugins/composer')
  })

  it('should mount a composable plugin', async () => {
    const id = 'custom-id'
    const json = {
      fetcher: stub().resolves({ content: { attributes: { id }, content: 'Hello!', tag: 'div' } }),
      validator: stub().resolves({ content: { attributes: { id }, content: 'Hello!', tag: 'div' } }),
    }
    const appender = stub()
    const props: ComposableApplicationProperties & {name: string} = {
      composerApi: {
        createComposerContext: stub().resolves(appender),
        premount: stub().resolves({}),
      },
      config: './config.json',
      container: 'my container',
      microlcApi: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        getExtensions() {
          return {
            json,
          }
        },
      },
      name: 'application',
      schema: {},
    }

    const { bootstrap, mount } = (window.__MICRO_LC_COMPOSER ?? {}) as Partial<MicroApp> & {
      bootstrap?: (props: ComposableApplicationProperties & {name: string}) => Promise<null>
      mount?: (props: ComposableApplicationProperties & {name: string}) => Promise<null>
    }

    await bootstrap?.(props)
    expect(json.fetcher).to.be.calledOnceWith(props.config)
    expect(json.validator).to.be.calledOnce
    expect(props.composerApi.premount).to.be.calledOnce

    await mount?.(props)
    expect(props.composerApi.createComposerContext).to.be.calledOnce
    expect(appender).to.be.calledOnceWith('my container')
  })
})
