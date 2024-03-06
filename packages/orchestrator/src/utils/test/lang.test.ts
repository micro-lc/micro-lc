import { expect } from 'chai'

import { craftLanguageHeader } from '../lang.js'

describe('language header tests', () => {
  before(() => {
    globalThis.window = {
      navigator: {
        language: 'en-US',
      },
    } as unknown as Window & typeof globalThis
  })

  it('should return a language header', () => {
    expect(craftLanguageHeader()).to.have.property('Accept-Language', 'en-US, en;q=0.5')
  })
  it('should return a language header', () => {
    expect(craftLanguageHeader('en')).to.have.property('Accept-Language', 'en')
  })
  it('should return a language header', () => {
    expect(craftLanguageHeader('it-IT')).to.have.property('Accept-Language', 'it-IT, it;q=0.5')
  })
})
