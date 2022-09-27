import { expect, chai } from '@open-wc/testing'
import chaiString from 'chai-string'

import { ImportMapRegistry, assignContent, createImportMapTag } from '../../src/dom-manipulation'

chai.use(chaiString)

describe('importmap manipulation tests', () => {
  afterEach(() => {
    // ensure flushing
    expect(document.head.querySelectorAll('script[type=importmap]')).to.have.length(0)
    expect(document.head.querySelectorAll('script[type=importmap-shim]')).to.have.length(0)
  })

  it('should assign importmap content to a tag', () => {
    const el = document.createElement('script')

    expect(assignContent(el, {}).textContent).to.equal('{}')
  })

  it('should create an importmap element according with shim option', () => {
    expect(createImportMapTag(document).textContent).to.equal('{}')
    expect(createImportMapTag(document).type).to.equal('importmap-shim')
    expect(createImportMapTag(document, true).type).to.equal('importmap')
  })

  it(`should use a registry to append and remove importmaps; then toggle shims and check
      the updated scripts`, () => {
    const target = Object.assign<HTMLElement, {disableShims: boolean}>(document.createElement('div'), {
      disableShims: false,
    })

    const registry = new ImportMapRegistry(target)

    expect(registry.get('id')).to.be.undefined

    const importmap = { imports: { dep: 'https://cdn.jsdelivr.net/dep@latest/index.js' } }
    registry.createSetMount('id', importmap)

    expect(document.head.querySelector('script[type=importmap-shim]')).to.have.property(
      'textContent', JSON.stringify(importmap)
    )

    registry.remove('id')
    expect(document.head.querySelector('script[type=importmap-shim]')).to.be.null

    target.disableShims = true

    registry.createSetMount('id', importmap)

    expect(document.head.querySelector('script[type=importmap]')).to.have.property(
      'textContent', JSON.stringify(importmap)
    )

    registry.remove('id')
    expect(document.head.querySelector('script[type=importmap]')).to.be.null

    registry.removeAll()
  })

  it('registry should re-use importmap elements', () => {
    const target = Object.assign<HTMLElement, {disableShims: boolean}>(document.createElement('div'), {
      disableShims: false,
    })

    const registry = new ImportMapRegistry(target)

    expect(registry.get('id')).to.be.undefined

    const importmap = { imports: { dep: 'https://cdn.jsdelivr.net/dep@latest/index.js' } }
    registry.createSetMount('id', importmap)

    const nextImportMap = { imports: {} }
    target.disableShims = true
    registry.createSetMount('id', nextImportMap)

    expect(document.head.querySelector('script[type=importmap]')).to.have.property(
      'textContent', JSON.stringify(nextImportMap)
    )
    expect(registry.getImportmap('id')).to.eql(nextImportMap)
    expect(registry.getImportmap('whatever')).to.be.undefined
    expect(document.head.querySelector('script[type=importmap-shim]')).to.be.null
    registry.removeAll()
  })
})
