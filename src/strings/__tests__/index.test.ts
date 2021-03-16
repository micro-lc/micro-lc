import en from '../locales/en.json'
import it from '../locales/it.json'

describe('string', () => {
  describe('en should be in it', () => {
    const enKeys = Object.keys(en)
    for (let i = 0; i < enKeys.length; i++) {
      test(enKeys[i], () => {
        // @ts-ignore
        expect(it[enKeys[i]]).not.toBe(undefined)
      })
    }
  })

  describe('it should be in en', () => {
    const itKeys = Object.keys(it)
    for (let i = 0; i < itKeys.length; i++) {
      test(itKeys[i], () => {
        // @ts-ignore
        expect(en[itKeys[i]]).not.toBe(undefined)
      })
    }
  })
})
