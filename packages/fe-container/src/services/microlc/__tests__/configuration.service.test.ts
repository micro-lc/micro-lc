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
