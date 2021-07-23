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
import {DecoratedFastify, DecoratedRequest} from '@mia-platform/custom-plugin-lib'

import {configurationApiHandlerBuilder} from '../configurationApi'
import validMicrolcConfig from '../../__tests__/configurationMocks/validMicrolcConfig.json'
import validMicrolcRecursiveConfig from '../../__tests__/configurationMocks/validMicrolcRecursiveConfig.json'

describe('Configuration api tests', () => {
  const fastifyInstanceBuilder = (configFile = 'validMicrolcConfig') => {
    // @ts-ignore
    return {
      config: {
        MICROLC_CONFIGURATION_PATH: path.join(__dirname, '../../__tests__/configurationMocks/', `${configFile}.json`),
        GROUPS_HEADER_KEY: 'groups',
      },
    } as DecoratedFastify
  }

  const replySendMock = jest.fn()

  // @ts-ignore
  const requestMock: DecoratedRequest = {
    headers: {
      groups: 'admin,developer',
    },
    getGroups: () => ['admin', 'developer'],
  }

  // @ts-ignore
  const noHeaderRequest: DecoratedRequest = {
    headers: {},
    getGroups: () => [],
  }

  // @ts-ignore
  const replyMock: fastify.FastifyReply<http.ServerResponse> = {
    send: replySendMock,
  }

  it('Correctly create handler', async() => {
    const handler = await configurationApiHandlerBuilder(fastifyInstanceBuilder())
    // @ts-ignore
    handler(requestMock, replyMock)
    expect(replySendMock).toHaveBeenCalledWith(validMicrolcConfig)
  })

  it('Correctly create handler with empty header', async() => {
    const handler = await configurationApiHandlerBuilder(fastifyInstanceBuilder())
    // @ts-ignore
    handler(noHeaderRequest, replyMock)
    expect(replySendMock).toHaveBeenCalledWith(validMicrolcConfig)
  })

  it('Correctly create handler with empty header and empty plugins', async() => {
    const handler = await configurationApiHandlerBuilder(fastifyInstanceBuilder('validMicrolcConfigNoPlugins'))
    // @ts-ignore
    handler(noHeaderRequest, replyMock)
    expect(replySendMock).toHaveBeenCalledWith(validMicrolcConfig)
  })

  it('Correctly create handler with recursive plugin', async() => {
    const handler = await configurationApiHandlerBuilder(fastifyInstanceBuilder('validMicrolcRecursiveConfig'))
    // @ts-ignore
    handler(noHeaderRequest, replyMock)
    expect(replySendMock).toHaveBeenCalledWith(validMicrolcRecursiveConfig)
  })
})
