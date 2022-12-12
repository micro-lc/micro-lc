import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { Response } from 'node-fetch'
import type { SinonStub } from 'sinon'
import { createSandbox } from 'sinon'
import sinonChai from 'sinon-chai'

import { jsonFetcher, jsonToObject } from '../json'
import * as schemas from '../schemas'


use(sinonChai)
use(chaiAsPromised)

describe('json fetch api tests', () => {
  const sandbox = createSandbox()
  const fetch: SinonStub<[input: RequestInfo | URL, init?: RequestInit | undefined], Promise<globalThis.Response>> = sandbox.stub()

  before(() => {
    Object.defineProperty(globalThis, 'document', { configurable: true, value: { baseURI: 'http://localhost/' }, writable: true })
    Object.defineProperty(globalThis, 'fetch', { value: fetch, writable: true })
  })

  after(() => {
    sandbox.restore()
  })

  beforeEach(() => {
    sandbox.reset()
  })

  it(`
    json fetcher test:
    - should return a config json file with the proper content type
    - should override the 'Accept' header and let through the remaining headers
    - should let through any other property
  `, async () => {
    const content = {}
    fetch.callsFake((input: RequestInfo | URL, init: RequestInit = {}) => {
      const { pathname } = new URL(input as string | URL, globalThis.document.baseURI)
      expect(init.credentials).to.equal('same-origin')
      expect(init.headers).to.have.property('Access-Control-Allow-Origin', '*')
      expect(init.headers).to.have.property('Accept', 'application/json, text/x-json, application/yaml, application/x-yaml, text/yaml')
      return pathname === '/config.json'
        ? Promise.resolve(new Response(
          JSON.stringify(content), {
            headers: {
              'Content-Type': 'application/json',
            },
            status: 200,
          }
        )) as unknown as Promise<globalThis.Response>
        : Promise.reject(new TypeError('not found'))
    })

    const json = await jsonFetcher('/config.json', { credentials: 'same-origin', headers: { Accept: 'text/plain', 'Access-Control-Allow-Origin': '*' } })

    expect(fetch).to.be.calledOnce
    expect(JSON.stringify(json)).to.equal('{}')
  })

  it(`
    yaml fetcher test:
    - should return a config yaml file with the proper content type
    - should override the 'Accept' header and let through the remaining headers
    - should let through any other property
  `, async () => {
    const content = `
      version: 2
    `
    fetch.callsFake((input: RequestInfo | URL, init: RequestInit = {}) => {
      const { pathname } = new URL(input as string | URL, globalThis.document.baseURI)
      expect(init.credentials).to.equal('same-origin')
      expect(init.headers).to.have.property('Access-Control-Allow-Origin', '*')
      expect(init.headers).to.have.property('Accept', 'application/json, text/x-json, application/yaml, application/x-yaml, text/yaml')
      return pathname === '/config.yaml'
        ? Promise.resolve(new Response(
          content, {
            headers: {
              'Content-Type': 'text/yaml',
            },
            status: 200,
          }
        )) as unknown as Promise<globalThis.Response>
        : Promise.reject(new TypeError('not found'))
    })

    const json = await jsonFetcher('/config.yaml', { credentials: 'same-origin', headers: { Accept: 'text/plain', 'Access-Control-Allow-Origin': '*' } })

    console.log(process.env.NODE_ENV)
    expect(fetch).to.be.calledOnce
    expect(JSON.stringify(json)).to.equal('{"version":2}')
  })
})

describe('json to object schema validation util', () => {
  it('should throw on wrong config file against given schemas', (done) => {
    const config = {
      applications: [],
      version: 2,
    }
    jsonToObject(config, { id: schemas.configSchema.$id, parts: schemas })
      .catch((err) => {
        expect((err as TypeError).message).to.equal('21')
        done()
      })
  })

  it('should throw on wrong config file against given schemas', async () => {
    const config = {
      applications: {},
      version: 2,
    }
    const validatedConfig = await jsonToObject(config, { id: schemas.configSchema.$id, parts: schemas })
    expect(validatedConfig).to.deep.equal(config)
  })
})
