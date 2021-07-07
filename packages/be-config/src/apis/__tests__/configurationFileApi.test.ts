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

import validMicrolcConfig from '../../__tests__/configurationMocks/validMicrolcConfig.json'

import {configurationFileApiHandlerBuilder} from '../configurationFileApi'

describe('Configuration api tests', () => {
  const fastifyInstanceBuilder = () => {
    // @ts-ignore
    return {
      config: {
        PLUGINS_CONFIGURATIONS_PATH: path.join(__dirname, '../../__tests__/configurationMocks'),
        GROUPS_HEADER_KEY: 'groups',
      },
    } as DecoratedFastify
  }

  const replySendMock = jest.fn()

  // @ts-ignore
  const requestBuilderMock: fastify.FastifyRequest = (fileName) => ({
    headers: {
      groups: 'admin,developer',
    },
    params: {
      configurationName: fileName,
    },
  })

  // @ts-ignore
  const replyMock: fastify.FastifyReply<http.ServerResponse> = {
    send: replySendMock,
  }

  it('Correctly create handler', async() => {
    const handler = configurationFileApiHandlerBuilder(fastifyInstanceBuilder())
    // @ts-ignore
    await handler(requestBuilderMock('validMicrolcConfig'), replyMock)
    expect(replySendMock).toHaveBeenCalledWith(validMicrolcConfig)
  })

  it('Correctly create handler with empty header', async() => {
    const handler = configurationFileApiHandlerBuilder(fastifyInstanceBuilder())
    // @ts-ignore
    await handler({headers: {}, params: {configurationName: 'validMicrolcConfig'}}, replyMock)
    expect(replySendMock).toHaveBeenCalledWith(validMicrolcConfig)
  })

  it('Correctly handle not existent file', async() => {
    const handler = configurationFileApiHandlerBuilder(fastifyInstanceBuilder())
    await expect(async() => {
      // @ts-ignore
      await handler(requestBuilderMock('invalidFile'), replyMock)
    }).rejects.toThrow()
  })
})
