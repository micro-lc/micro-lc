import { expect } from 'chai'

import { compile, interpolate } from '../compiler'

describe('handlebars tests', () => {
  it('should parse a well formatted string', () => {
    const __css = [{ key: { another_key: 0 } }]
    const input = '__css.[0].key.[\'another_key\']'

    expect(compile<{__css: typeof __css}>(input)({ __css })).to.equal(0)
  })

  it('should throw on badly formatted string', () => {
    const __css = [{ key: { another_key: 0 } }]
    const input = '__css[0].key.[\'another_key\']'

    expect(compile<{__css: typeof __css}>(input)({ __css })).to.be.undefined
  })

  it('should throw on weird numbering', () => {
    const __css = [{ key: { another_key: 0 } }]
    const input = '__css.[1].key.[\'another_key\']'

    expect(compile<{__css: typeof __css}>(input)({ __css })).to.be.undefined
  })

  it('should throw on weird key', () => {
    const __css = [{ key: { another_key: 0 } }]
    const input = '__css.[1].key.[\'\']'

    let error: TypeError | unknown
    try {
      compile<{__css: typeof __css}>(input)({ __css })
    } catch (err: TypeError | unknown) {
      error = err
    }

    expect((error as TypeError).message).to.equal('42')
  })
})

describe('interpolation tests', () => {
  it('should interpolate a string', () => {
    expect(interpolate(['"a string"', ''])).to.eql(['a string', ''])
  })

  it('should interpolate a string with single quotes after trimming', () => {
    expect(interpolate(['  \'a string\'              '])).to.eql(['a string'])
  })

  it('should interpolate an integer', () => {
    expect(interpolate(['  0              '])).to.eql([0])
  })

  it('should interpolate a float', () => {
    expect(interpolate(['0.39'])).to.eql([0.39])
  })

  it('should interpolate a boolean', () => {
    expect(interpolate(['   true', '\r\n\n   false'])).to.eql([true, false])
  })

  it('should interpolate an object and/or an array', () => {
    expect(interpolate(['   [ "asd", 0   , null         ]', '{  "0": "asd"}']))
      .to.eql([['asd', 0, null], { 0: 'asd' }])
  })

  it('should interpolate an extra prop from context', () => {
    const extraProp = ['asd', { asd: 0 }]
    expect(interpolate(['extraProp', 'extraProp.[0]', 'extraProp.[1].[\'asd\']'], { extraProp }))
      .to.eql([['asd', { asd: 0 }], 'asd', 0])
  })

  it('should throw on weird json input on context', () => {
    try {
      interpolate([' {'])
    } catch (err) {
      expect((err as TypeError).message).to.equal('43')
    }
  })
})
