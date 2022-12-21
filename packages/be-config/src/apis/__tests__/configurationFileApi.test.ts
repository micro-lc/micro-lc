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
import fs from 'fs'
import http from 'http'
import {DecoratedFastify, DecoratedRequest} from '@mia-platform/custom-plugin-lib'

import validMicrolcConfig from '../../__tests__/configurationMocks/validMicrolcConfig.json'

import {configurationFileApiHandlerBuilder} from '../configurationFileApi'

describe('Configuration api tests', () => {
  const fastifyInstanceBuilder = (pathSuffix = '') => {
    // @ts-ignore
    return {
      config: {
        PLUGINS_CONFIGURATIONS_PATH: path.join(__dirname, `../../__tests__/configurationMocks${pathSuffix}`),
        GROUPS_HEADER_KEY: 'groups',
      },
    } as DecoratedFastify
  }

  const replySendMock = jest.fn()
  const replyHeaderMock = jest.fn()

  // @ts-ignore
  const requestBuilderMock = (fileName): DecoratedRequest => ({
    headers: {
      groups: 'admin,developer',
    },
    params: {
      configurationName: fileName,
    },
    getGroups: () => ['admin', 'developer'],
  })

  // @ts-ignore
  const replyMock: fastify.FastifyReply<http.ServerResponse> = {
    header: replyHeaderMock,
    send: replySendMock,
  }

  it('Correctly handle valid json', async() => {
    const handler = configurationFileApiHandlerBuilder(fastifyInstanceBuilder())
    // @ts-ignore
    await handler(requestBuilderMock('validMicrolcConfig.json'), replyMock)
    expect(replySendMock).toHaveBeenCalledWith(validMicrolcConfig)
    expect(replyHeaderMock).toHaveBeenCalledWith('Content-Type', 'application/json')
  })

  it('Correctly handle valid json with empty header', async() => {
    const handler = configurationFileApiHandlerBuilder(fastifyInstanceBuilder())
    // @ts-ignore
    await handler({headers: {}, params: {configurationName: 'validMicrolcConfig.json'}, getGroups: () => []}, replyMock)
    expect(replySendMock).toHaveBeenCalledWith(validMicrolcConfig)
    expect(replyHeaderMock).toHaveBeenCalledWith('Content-Type', 'application/json')
  })

  it('Correctly create handler for non json file', async() => {
    const desiredFile = 'index.test.ts'
    const handler = configurationFileApiHandlerBuilder(fastifyInstanceBuilder('/../'))
    // @ts-ignore
    await handler(requestBuilderMock(desiredFile), replyMock)
    const testFileContent = (await fs.promises.readFile(path.join(__dirname, `../../__tests__/${desiredFile}`))).toString('utf-8')
    expect(replySendMock).toHaveBeenCalledWith(testFileContent)
    expect(replyHeaderMock).toHaveBeenCalledWith('Content-Type', 'text/plain')
  })

  it('Correctly create handler for javascript file', async() => {
    const desiredFile = 'micro-lc-base.js'
    const handler = configurationFileApiHandlerBuilder(fastifyInstanceBuilder('/../'))
    // @ts-ignore
    await handler(requestBuilderMock(desiredFile), replyMock)
    const testFileContent = (await fs.promises.readFile(path.join(__dirname, `../../__tests__/${desiredFile}`))).toString('utf-8')
    expect(replySendMock).toHaveBeenCalledWith(testFileContent)
    expect(replyHeaderMock).toHaveBeenCalledWith('Content-Type', 'application/javascript')
  })

  it('Correctly create handler for html file', async() => {
    const desiredFile = 'index.html'
    const handler = configurationFileApiHandlerBuilder(fastifyInstanceBuilder('/../'))
    // @ts-ignore
    await handler(requestBuilderMock(desiredFile), replyMock)
    const testFileContent = (await fs.promises.readFile(path.join(__dirname, `../../__tests__/${desiredFile}`))).toString('utf-8')
    expect(replySendMock).toHaveBeenCalledWith(testFileContent)
    expect(replyHeaderMock).toHaveBeenCalledWith('Content-Type', 'text/html')
  })

  it('Correctly handle not existent file', async() => {
    const handler = configurationFileApiHandlerBuilder(fastifyInstanceBuilder())
    await expect(async() => {
      // @ts-ignore
      await handler(requestBuilderMock('invalidFile'), replyMock)
    }).rejects.toThrow()
  })
})
