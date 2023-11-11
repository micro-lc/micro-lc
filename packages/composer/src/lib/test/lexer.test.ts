// SAFETY: tests here require templates inside strings
/* eslint-disable no-template-curly-in-string */
import { expect, use } from 'chai'
import { createSandbox } from 'sinon'
import sinonChai from 'sinon-chai'

import { lexer } from '../lexer'
import logger from '../logger'

use(sinonChai)

describe('lexer tests', () => {
  before(() => {
    Object.defineProperty(global, 'window', {
      value: {
        crypto: {
          subtle: {
            digest: () => { return Promise.resolve(Buffer.from(Math.random().toString())) },
          },
        },
      },
      writable: true,
    })
  })

  interface Test {input: string; output?: {literals: string[]; variables: string[]}}
  const tests: Test[] = [
    {
      input: '',
      output: { literals: [''], variables: [] },
    },
    {
      input: '<div>Content</div>',
    },
    {
      input: '<div ${',
    },
    {
      input: '<div $',
    },
    {
      input: '<div .content="Content"></div>',
    },
    {
      // this is fixed by `lit-html`
      input: '<div .content={"Content"}></div>',
    },
    {
      input: '<div .content=${"Content"}></div>',
      output: { literals: ['<div .content=', '></div>'], variables: ['"Content"'] },
    },
    {
      input: '<div .content=${\'Content\'}></div>',
      output: { literals: ['<div .content=', '></div>'], variables: ['\'Content\''] },
    },
    {
      input: '<div .content=${"Conte${watch out}nt"}></div>',
      output: { literals: ['<div .content=', '></div>'], variables: ['"Conte${watch out}nt"'] },
    },
    {
      input: '<div .content=$"Content"}></div>',
    },
    {
      input: '<div .content=${{"Content"}}></div>',
      output: { literals: ['<div .content=', '></div>'], variables: ['{"Content"}'] },
    },
    {
      input: '<div .content=${0}></div>',
      output: { literals: ['<div .content=', '></div>'], variables: ['0'] },
    },
    {
      input: '<div .co$ntent=${0}></div>',
      output: { literals: ['<div .co$ntent=', '></div>'], variables: ['0'] },
    },
    {
      input: '<div .content=${0}></div>$',
      output: { literals: ['<div .content=', '></div>$'], variables: ['0'] },
    },
    {
      input: '${',
      output: {literals: ['${'], variables: []}
    },
    {
      input: '<div ${} $',
      output: {literals: ['<div ', ' $'], variables: ['']}
    },
    {
      input: '<div ${} ${',
      output: {literals: ['<div ', ' ${'], variables: ['']}
    }
  ]

  for (const test of tests) {
    const { input, output: { literals, variables } = { literals: [input], variables: [] } } = test
    // eslint-disable-next-line no-await-in-loop
    it(`should match lexer parsing results on input '${input}'`, async () => {
      const result = await lexer(input)
      
      expect(result.literals.raw).to.be.eql(literals)
      expect(result.variables).to.be.eql(variables)

      expect(result.literals).to.have.lengthOf(result.variables.length + 1)
    })
  }
})

describe('cache tests', () => {
  before(() => {
    Object.defineProperty(global, 'window', {
      value: {
        crypto: {
          subtle: {
            digest: () => { return Promise.resolve('0') },
          },
        },
      },
      writable: true,
    })
  })
  it('should return cached value on second call', async () => {
    const result1 = await lexer('')
    const result2 = await lexer('fake cache')
    expect(result1.literals).to.eql(result2.literals)
  })
})

describe('digest throws', () => {
  before(() => {
    Object.defineProperty(global, 'window', {
      value: {
        crypto: {
          subtle: {
            digest: () => { return Promise.reject(new TypeError('error')) },
          },
        },
      },
      writable: true,
    })
  })
  it('should return cached value on second call', async () => {
    const sandbox = createSandbox()
    const loggerError = sandbox.stub(logger, 'error')

    const result = await lexer('${a}')

    expect(result.literals).to.eql(['', ''])
    expect(result.variables).to.eql(['a'])
    expect(loggerError).to.be.calledOnce

    sandbox.restore()
  })
})
