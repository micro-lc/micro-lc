import type { Content, PluginConfiguration } from '@micro-lc/interfaces'
import { expect, use } from 'chai'
import chaiString from 'chai-string'
import type { SinonSandbox } from 'sinon'
import { createSandbox } from 'sinon'

import { jsonToHtml } from '../json'

use(chaiString)

const makeConfig = (content: Content): PluginConfiguration => ({ content })

describe('json2html parser tests', () => {
  let sandbox: SinonSandbox

  beforeEach(() => {
    sandbox = createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should parse empty content input to empty string', () => {
    expect(jsonToHtml(makeConfig(''))).to.equal('')
  })

  it('should parse string to string', () => {
    expect(jsonToHtml(makeConfig('text content'))).to.equal('text content')
  })

  it('should parse a node with single element', () => {
    expect(jsonToHtml(makeConfig({ tag: 'div' }))).to.equalIgnoreSpaces('<div></div>')
  })

  it('should parse a node with an empty array', () => {
    expect(jsonToHtml(makeConfig([]))).to.equal('')
  })

  it('should parse attributes', () => {
    expect(
      jsonToHtml(makeConfig({
        attributes: { role: 'button' },
        tag: 'div',
      }))
    ).to.equalIgnoreSpaces('<div role="button"></div>')
  })

  it('should parse properties', () => {
    expect(jsonToHtml(makeConfig({
      attributes: { role: 'button' },
      properties: {
        arr: [0, 1, 2, 3],
        boolean: true,
        number: 0,
        obj: { key: 'val"ue' },
        string: 's',
      },
      tag: 'div',
    }))).to.equalIgnoreSpaces(`
      <div
        role="button"
        .arr=\${[0,1,2,3]}
        .boolean=\${true}
        .number=\${0}
        .obj=\${{"key":"val\\"ue"}}
        .string=\${"s"}
      ></div>
    `)
  })
})

describe('json2html parser recursive tests', () => {
  it('should parse a string in a div', () => {
    expect(jsonToHtml(makeConfig({
      attributes: { role: 'button' },
      content: 'Hello',
      tag: 'div',
    }))).to.equalIgnoreSpaces(`
      <div role="button">
        Hello
      </div>
    `)
  })

  it('should parse a `ol` list', () => {
    expect(jsonToHtml(makeConfig({
      content: [
        { content: 'Coffee', tag: 'li' },
        { content: 'Tea', tag: 'li' },
        { content: 'Milk', tag: 'li' },
      ],
      tag: 'ol',
    }))).to.equalIgnoreSpaces(`
      <ol>
        <li>Coffee</li>
        <li>Tea</li>
        <li>Milk</li>
      </ol>
    `)
  })

  it('should parse a single child with multiple array types', () => {
    expect(jsonToHtml(makeConfig({
      booleanAttributes: ['hidden', 'disabled'],
      content: {
        attributes: {
          height: '240', width: '320',
        },
        booleanAttributes: 'controls',
        content: [
          { attributes: { src: './movie.mp4', type: 'video/mp4' }, tag: 'source' },
          'Hello',
        ],
        tag: 'video',
      },
      tag: 'div',
    }))).to.equalIgnoreSpaces(`
      <div hidden disabled>
        <video height="240" width="320" controls>
          <source src="./movie.mp4" type="video/mp4"></source>
          Hello
        </video>
      </div>
    `)
  })
})
