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

  it('should return window language', () => {
    expect(craftLanguageHeader(undefined, undefined)).to.have.property('Accept-Language', 'en-US, en;q=0.5')
  })
  it('should return injected language', () => {
    expect(craftLanguageHeader('en', undefined)).to.have.property('Accept-Language', 'en')
  })
  it('should return injected language with secondary subtag', () => {
    expect(craftLanguageHeader('it-IT', undefined)).to.have.property('Accept-Language', 'it-IT, it;q=0.5')
  })
  it('should return injected language with fallback subtag', () => {
    expect(craftLanguageHeader('it', 'en')).to.have.property('Accept-Language', 'it, en;q=0.1')
  })
  it('should return injected language without fallback subtag because already there', () => {
    expect(craftLanguageHeader('it, en;q=0.5', 'en')).to.have.property('Accept-Language', 'it, en;q=0.5')
  })
  it('should return injected language with secondary and fallback subtag', () => {
    expect(craftLanguageHeader('it-IT', 'en')).to.have.property('Accept-Language', 'it-IT, it;q=0.5, en;q=0.1')
  })
})
