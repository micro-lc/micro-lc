import type { BaseExtension } from '@micro-lc/orchestrator/src'
import { fixtureCleanup } from '@open-wc/testing'
import { createSandbox } from 'sinon'

import type { MlcApi } from '../../src/web-components/mlc-layout/types'

describe.skip('mlc-layout', () => {
  const sandbox = createSandbox()

  const setIconStub = sandbox.stub()
  const setTitleStub = sandbox.stub()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const mockUser = { fullName: 'John Doe' }
  const httpClientStub = sandbox.stub()

  // @ts-expect-error // We do not need to implement all methods of the interface
  const microlcApiExtensions: BaseExtension = {
    head: {
      setIcon: setIconStub,
      setTitle: setTitleStub,
    },
    httpClient: httpClientStub,
  }

  const goToStub = sandbox.stub()
  const goToApplicationStub = sandbox.stub()
  const openStub = sandbox.stub()
  const setStub = sandbox.stub()
  const setExtensionStub = sandbox.stub().returns(microlcApiExtensions)
  const currentApplicationUnsubscribeStub = sandbox.stub()
  const currentApplicationSubscribeStub = sandbox.stub()
    .returns({ closed: false, unsubscribe: currentApplicationUnsubscribeStub })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const microlcApi: Partial<MlcApi> = {
    currentApplication$: { subscribe: currentApplicationSubscribeStub },
    getExtensions: () => microlcApiExtensions,
    router: {
      goTo: goToStub,
      goToApplication: goToApplicationStub,
      goToErrorPage: sandbox.stub(),
      open: openStub,
      pushState: sandbox.stub(),
      replaceState: sandbox.stub(),
    },
    set: setStub,
    setExtension: setExtensionStub,
  }

  beforeEach(() => sandbox.reset())

  afterEach(() => { fixtureCleanup() })

  after(() => sandbox.restore())
})
