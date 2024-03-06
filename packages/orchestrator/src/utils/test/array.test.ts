import { expect } from 'chai'

import { toArray } from '../array.js'

describe('array utils tests', () => {
  it('should return an array', () => {
    expect(toArray('')).to.deep.equal([''])
    expect(toArray([''])).to.deep.equal([''])
  })
})
