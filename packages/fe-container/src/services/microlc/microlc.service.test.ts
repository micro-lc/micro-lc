import nock from 'nock'

import {CONFIGURATION_SERVICE, GET_USER_SERVICE} from '@constants'
import {retrieveConfiguration, retrieveUser} from './microlc.service'

nock.disableNetConnect()

describe('microlc configuration service test', () => {
  const configurationUrl = `${CONFIGURATION_SERVICE.BASE_URL}${CONFIGURATION_SERVICE.ENDPOINT}`
  const userUrl = `${GET_USER_SERVICE.BASE_URL}${GET_USER_SERVICE.ENDPOINT}`

  beforeAll(() => {
    nock.cleanAll()
  })

  it('return the response content for configuration', (done) => {
    const mockedResponse = nock('http://localhost')
      .get(configurationUrl)
      .reply(200, {
        theming: {
          logo: 'test'
        },
        plugins: [
          {id: 'test-plugin'}
        ]
      })

    retrieveConfiguration()
      .subscribe((response) => {
        expect(response.theming?.logo).toEqual('test')
        expect(response.plugins?.length).toEqual(1)
        expect(response.plugins?.[0].id).toEqual('test-plugin')
        mockedResponse.done()
        done()
      })
  })

  it('return empty response for http errors', (done) => {
    const mockedResponse = nock('http://localhost')
      .get(configurationUrl)
      .reply(500)

    retrieveConfiguration()
      .subscribe((response) => {
        expect(response).toEqual({})
        expect(response.theming).toBeUndefined()
        expect(response.theming?.logo).toBeUndefined()
        expect(response.plugins).toBeUndefined()
        expect(response.plugins?.length).toBeUndefined()
        expect(response.plugins?.[0].id).toBeUndefined()
        mockedResponse.done()
        done()
      })
  })

  it('return the response content for user', (done) => {
    const mockedResponse = nock('http://localhost')
      .get(userUrl)
      .reply(200, {
        email: 'mocked.user@mia-platform.eu',
        groups: [
          'users',
          'admin'
        ],
        name: 'Mocked User',
        nickname: 'mocked.user',
        phone: '+393333333333',
        picture: 'https://i2.wp.com/cdn.auth0.com/avatars/md.png?ssl=1'
      })

    retrieveUser()
      .subscribe((response) => {
        expect(response.email).toEqual('mocked.user@mia-platform.eu')
        expect(response.groups?.length).toEqual(2)
        expect(response.groups?.[0]).toEqual('users')
        expect(response.name).toEqual('Mocked User')
        expect(response.nickname).toEqual('mocked.user')
        expect(response.phone).toEqual('+393333333333')
        expect(response.picture).toEqual('https://i2.wp.com/cdn.auth0.com/avatars/md.png?ssl=1')
        mockedResponse.done()
        done()
      })
  })
})
