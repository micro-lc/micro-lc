/*
 * Copyright 2021 Mia srl
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import nock from 'nock'

import {logOutUser, logOutUserBuilder, retrieveUser} from '@services/microlc/user.service'
import {User} from '@mia-platform/core'
import {expect} from '@playwright/test'

describe('User service tests', () => {
  const userUrl = '/api/v1/microlc/user'
  const logOutUrl = '/api/v1/microlc/user/logout'

  Object.defineProperty(window, 'location', {
    value: {
      href: 'http://localhost'
    },
    writable: true
  })

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
        picture: 'https://i2.wp.com/cdn.auth0.com/avatars/md.png?ssl=1'
      })

    retrieveUser(userUrl)
      .subscribe((response: Partial<User>) => {
        expect(response.email).toEqual('mocked.user@mia-platform.eu')
        expect(response.groups?.length).toEqual(2)
        expect(response.groups?.[0]).toEqual('users')
        expect(response.name).toEqual('Mocked User')
        expect(response.nickname).toEqual('mocked.user')
        expect(response.picture).toEqual('https://i2.wp.com/cdn.auth0.com/avatars/md.png?ssl=1')
        mockedResponse.done()
        done()
      })
  })

  it('return empty user logout response for http ok', () => {
    logOutUserBuilder(logOutUrl)
    logOutUser()
    expect(window.location.href).toBe(logOutUrl)
  })

  it('Empty observable for invalid url', (done) => {
    retrieveUser(undefined).subscribe((retrievedUser) => {
      expect(retrievedUser).toStrictEqual({})
      done()
    })
  })
})
