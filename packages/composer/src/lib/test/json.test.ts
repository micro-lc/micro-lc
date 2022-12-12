import { expect, use } from 'chai'
import chaiString from 'chai-string'
import type { SinonSandbox } from 'sinon'
import { createSandbox } from 'sinon'

import { jsonToHtml } from '../json'

use(chaiString)

describe('json2html parser tests', () => {
  let sandbox: SinonSandbox

  beforeEach(() => {
    sandbox = createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should parse empty content input to empty string', () => {
    expect(jsonToHtml('')).to.equal('')
  })

  it('should parse string to string', () => {
    expect(jsonToHtml('text content')).to.equal('text content')
  })

  it('should parse a node with single element', () => {
    expect(jsonToHtml({ tag: 'div' })).to.equalIgnoreSpaces('<div></div>')
  })

  it('should parse a node with an empty array', () => {
    expect(jsonToHtml([])).to.equal('')
  })

  it('should parse attributes', () => {
    expect(
      jsonToHtml({
        attributes: { role: 'button' },
        tag: 'div',
      })
    ).to.equalIgnoreSpaces('<div role="button"></div>')
  })

  it('should parse properties', () => {
    expect(jsonToHtml({
      attributes: { role: 'button' },
      properties: {
        arr: [0, 1, 2, 3],
        boolean: true,
        number: 0,
        obj: { key: 'val"ue' },
        string: 's',
      },
      tag: 'div',
    })).to.equalIgnoreSpaces(`
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
    expect(jsonToHtml({
      attributes: { role: 'button' },
      content: 'Hello',
      tag: 'div',
    })).to.equalIgnoreSpaces(`
      <div role="button">
        Hello
      </div>
    `)
  })

  it('should parse a number in a div', () => {
    expect(jsonToHtml({
      attributes: { role: 'button' },
      content: 0,
      tag: 'div',
    })).to.equalIgnoreSpaces(`
      <div role="button">
        0
      </div>
    `)
  })

  it('should parse a `ol` list', () => {
    expect(jsonToHtml({
      content: [
        { content: 'Coffee', tag: 'li' },
        { content: 'Tea', tag: 'li' },
        { content: 'Milk', tag: 'li' },
      ],
      tag: 'ol',
    })).to.equalIgnoreSpaces(`
      <ol>
        <li>Coffee</li>
        <li>Tea</li>
        <li>Milk</li>
      </ol>
    `)
  })

  it('should parse a single child with multiple array types', () => {
    expect(jsonToHtml({
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
    })).to.equalIgnoreSpaces(`
      <div hidden disabled>
        <video height="240" width="320" controls>
          <source src="./movie.mp4" type="video/mp4" />
          Hello
        </video>
      </div>
    `)
  })
})

describe('extraProps injection', () => {
  it('should parse a div and add extra-properties', () => {
    expect(jsonToHtml({
      attributes: { role: 'button' },
      content: 'Hello',
      tag: 'div',
    }, new Set(['extra']))).to.equalIgnoreSpaces(`
      <div role="button" .extra=\${extra}>
        Hello
      </div>
    `)
  })

  it('should parse a div and add extra-properties keeping user input', () => {
    expect(jsonToHtml({
      attributes: { role: 'button' },
      content: 'Hello',
      properties: { extra: 'userInput' },
      tag: 'div',
    }, new Set(['extra']))).to.equalIgnoreSpaces(`
      <div role="button" .extra=\${userInput}>
        Hello
      </div>
    `)
  })
})
