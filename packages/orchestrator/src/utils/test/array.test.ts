import { expect } from 'chai'

import { toArray } from '../array'

describe('array utils tests', () => {
  it('should return an array', () => {
    expect(toArray('')).to.deep.equal([''])
    expect(toArray([''])).to.deep.equal([''])
  })
})
