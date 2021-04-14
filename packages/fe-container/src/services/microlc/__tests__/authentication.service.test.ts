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
})
