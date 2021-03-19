import strings from '../index'

describe('strings', () => {
  describe('en strings should be in it', () => {
    const enKeys = Object.keys(strings.en)
    for (let i = 0; i < enKeys.length; i++) {
      test(enKeys[i], () => {
        expect(strings.it[enKeys[i]]).not.toBe(undefined)
      })
    }
  })

  describe('it strings should be in en', () => {
    const itKeys = Object.keys(strings.it)
    for (let i = 0; i < itKeys.length; i++) {
      test(itKeys[i], () => {
        expect(strings.en[itKeys[i]]).not.toBe(undefined)
      })
    }
  })
})
