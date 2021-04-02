import nock from 'nock'

import {USER_CONFIGURATION_SERVICE} from '@constants'
import {retrieveAuthentication} from '@services/microlc/authentication.service'

describe('Configuration service tests', () => {
  const authUrl = `${USER_CONFIGURATION_SERVICE.BASE_URL}${USER_CONFIGURATION_SERVICE.ENDPOINT}`

  beforeAll(() => {
    nock.cleanAll()
  })

  it('return the response content for configuration', (done) => {
    const mockedResponse = nock('http://localhost')
      .get(authUrl)
      .reply(200, {
        isAuthNecessary: true,
        authUrl: '/api/v1/microlc/user'
      })

    retrieveAuthentication()
      .subscribe((response) => {
        expect(response.isAuthNecessary).toEqual(true)
        expect(response.authUrl).toEqual('/api/v1/microlc/user')
        mockedResponse.done()
        done()
      })
  })

  it('return empty configuration response for http errors', (done) => {
    const mockedResponse = nock('http://localhost').get(authUrl).reply(500)

    retrieveAuthentication()
      .subscribe((response) => {
        expect(response).toStrictEqual({})
        mockedResponse.done()
        done()
      })
  })
})
