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

import {CONFIGURATION_SERVICE} from '@constants'
import {retrieveConfiguration} from '@services/microlc/configuration.service'

describe('Configuration service tests', () => {
  const configurationUrl = `${CONFIGURATION_SERVICE.BASE_URL}${CONFIGURATION_SERVICE.ENDPOINT}`

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
})
