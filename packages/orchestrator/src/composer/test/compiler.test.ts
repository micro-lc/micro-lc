import { expect } from 'chai'

import { compile } from '../compiler'

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
})
