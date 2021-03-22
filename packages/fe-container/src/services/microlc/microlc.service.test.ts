import nock from 'nock';

import {retrieveConfiguration} from './microlc.service'

nock.disableNetConnect()

describe('microlc configuration service test', () => {
  it('return the response content', (done) => {
    nock('http://localhost:80')
      .get('/api/v1/microlc/configuration')
      .reply(200, {
        theming: {
          logo: 'test'
        },
        plugins: [{
          id: 'test-plugin'
        }]
      })

    retrieveConfiguration()
      .subscribe((response) => {
        expect(response?.theming?.logo).toEqual('test')
        expect(response?.plugins?.length).toEqual(1)
        expect(response?.plugins?.[0].id).toEqual('test-plugin')
        done()
      })
  })

  it('return empty response for http errors', (done) => {
    nock('http://localhost:80')
      .get('/api/v1/microlc/configuration')
      .reply(500)

    retrieveConfiguration()
      .subscribe((response) => {
        expect(response).toEqual({})
        expect(response?.theming).toBeUndefined()
        expect(response?.theming?.logo).toBeUndefined()
        expect(response?.plugins).toBeUndefined()
        expect(response?.plugins?.length).toBeUndefined()
        expect(response?.plugins?.[0].id).toBeUndefined()
        done()
      })
  })
})
