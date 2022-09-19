/* eslint-disable no-template-curly-in-string */
import { expect } from 'chai'

import { lexer } from '../lexer'

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

  it('should match lexer parsing results', async () => {
    interface Test {input: string; output?: {literals: string[]; variables: string[]}}
    const tests: Test[] = [
      {
        input: '',
        output: { literals: [], variables: [] },
      },
      {
        input: '<div>Content</div>',
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
    ]

    for (const test of tests) {
      const { input, output: { literals, variables } = { literals: [input], variables: [] } } = test
      // eslint-disable-next-line no-await-in-loop
      const result = await lexer(input)
      expect(result.literals.raw).to.be.eql(literals)
      expect(result.variables).to.be.eql(variables)
    }
  })
})
