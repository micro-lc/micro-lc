import { expect } from 'chai'

import { effectiveRouteLength, urlMatch } from '../url-matcher'

describe('url-matcher tests', () => {
  const tests: [string, string, number, RegExpMatchArray | null][] = [
    ['/', '/', 1, Object.assign<RegExpMatchArray, {index: number}>(['/'], { index: 0 })],
    ['/app1', '/:appname', 1, Object.assign<RegExpMatchArray, {index: number}>(['/app1'], { index: 0 })],

    ['/app1/subpath', '/:appname', 1, Object.assign<RegExpMatchArray, {index: number}>(['/app1/subpath'], { index: 0 })],
    ['/123/app1/subpath', '/:id/:appname', 2, Object.assign<RegExpMatchArray, {index: number}>(['/123/app1/subpath'], { index: 0 })],

    ['/app1/subpath', '/app2/:appname', 6, null],
  ]

  tests.forEach(([pathname, against, expectedLength, expected]) => {
    it(`should match ${pathname} against ${against}`, () => {
      // length computation first
      expect(effectiveRouteLength(against)).to.equal(expectedLength)


      const match = urlMatch(pathname, against)

      if (expected === null) {
        expect(match).to.be.null
        return
      }

      expected.forEach((nthMatch, idx) => {
        expect(nthMatch).to.equal(match?.[idx])
      })
      expect(match?.index).to.equal(expected.index)
    })
  })
})
