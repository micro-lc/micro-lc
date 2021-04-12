import path from 'path'
import fastify from 'fastify'
import http from 'http'
import {DecoratedFastify} from '@mia-platform/custom-plugin-lib'

import {authenticationApiHandlerBuilder} from '../authenticationApi'

describe('Authentication api tests', () => {
  // @ts-ignore
  const fastifyInstance: DecoratedFastify = {
    config: {
      AUTHENTICATION_CONFIGURATION_PATH: path.join(__dirname, '../../__tests__/configurationMocks/validAuthenticationConfig.json'),
    },
  }

  const replySendMock = jest.fn()

  // @ts-ignore
  const replyMock: fastify.FastifyReply<http.ServerResponse> = {
    send: replySendMock,
  }

  it('Correctly create handler', async() => {
    const handler = await authenticationApiHandlerBuilder(fastifyInstance)
    // @ts-ignore
    handler(undefined, replyMock)
    expect(replySendMock).toHaveBeenCalledWith({
      'isAuthNecessary': true,
      'userInfoUrl': '/api/v1/microlc/user',
    })
  })
})
