import { expect } from 'chai'
import { ReplaySubject } from 'rxjs'

import { createPool } from '../pool'

describe('bus pool tests', () => {
  it('should spawn multiple buses and check equalities', () => {
    const bus = createPool()

    expect(bus instanceof ReplaySubject).to.be.true
    expect(bus[0]).to.be.equal(bus[0])
    expect(bus[0]).not.to.be.equal(bus[1])
    expect(bus[0]).not.to.be.equal(bus.pool.other)
    expect(bus.pool.other).to.be.equal(bus.pool.other)
    expect(bus.pool.next).not.to.be.equal(bus.pool.other)

    expect(typeof bus.next).to.be.equal('function')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    expect(typeof bus[Symbol.iterator]).to.be.equal('undefined')
  })
})
