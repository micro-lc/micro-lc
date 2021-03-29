import nock from 'nock'

import {logOutUser, retrieveUser} from '@services/microlc/user.service'
import {GET_USER_SERVICE, LOGOUT_USER_SERVICE} from '@constants'

describe('User service tests', () => {
  const userUrl = `${GET_USER_SERVICE.BASE_URL}${GET_USER_SERVICE.ENDPOINT}`
  const logOutUrl = `${LOGOUT_USER_SERVICE.BASE_URL}${LOGOUT_USER_SERVICE.ENDPOINT}`

  beforeAll(() => {
    nock.cleanAll()
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

  it('return empty user response for http errors', (done) => {
    const mockedResponse = nock('http://localhost').get(userUrl).reply(500)

    retrieveUser()
      .subscribe((response) => {
        expect(response).toStrictEqual({})
        mockedResponse.done()
        done()
      })
  })

  it('return empty user logout response for http errors', (done) => {
    const mockedResponse = nock('http://localhost').post(logOutUrl).reply(500)

    logOutUser()
      .subscribe((response) => {
        expect(response).toStrictEqual(false)
        mockedResponse.done()
        done()
      })
  })
})
