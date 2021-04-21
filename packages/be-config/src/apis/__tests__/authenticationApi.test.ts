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
      'userLogoutUrl': '/api/v1/microlc/user/logout',
    })
  })
})
