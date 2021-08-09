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

import {FastifyInstance} from 'fastify'
import path from 'path'

import validAuthenticationConfig from './configurationMocks/validAuthenticationConfig.json'
import validMicrolcConfig from './configurationMocks/validMicrolcConfig.json'
import {AUTHENTICATION_ENDPOINT, CONFIGURATION_ENDPOINT, CONFIGURATION_FILE_ENDPOINT} from '../constants'

export interface ProcessEnv {
  [key: string]: string | undefined
}

describe('index tests', () => {
  // eslint-disable-next-line global-require
  const lc39 = require('@mia-platform/lc39')

  let fastify: FastifyInstance

  async function setupFastify(envVariables: ProcessEnv) {
    fastify = await lc39('src/index.ts', {
      logLevel: 'silent',
      envVariables: {
        USERID_HEADER_KEY: 'miauserid',
        GROUPS_HEADER_KEY: 'miausergroups',
        CLIENTTYPE_HEADER_KEY: 'miaclienttype',
        BACKOFFICE_HEADER_KEY: 'miaisfrombackoffice',
        MICROSERVICE_GATEWAY_SERVICE_NAME: 'microservice-gateway',
        ...envVariables,
      },
    })
  }

  afterEach(async() => {
    await fastify.close()
  })

  test('Fastify correctly start', async() => {
    await setupFastify({
      AUTHENTICATION_CONFIGURATION_PATH: path.join(__dirname, '/configurationMocks/validAuthenticationConfig.json'),
      MICROLC_CONFIGURATION_PATH: path.join(__dirname, '/configurationMocks/validMicrolcConfig.json'),
    })
    expect(fastify).not.toBeNull()
    const authenticationContent = await fastify.inject({
      method: AUTHENTICATION_ENDPOINT.METHOD,
      url: AUTHENTICATION_ENDPOINT.PATH,
    })
    const configurationContent = await fastify.inject({
      method: CONFIGURATION_ENDPOINT.METHOD,
      url: CONFIGURATION_ENDPOINT.PATH,
    })
    const configurationFileContent = await fastify.inject({
      method: CONFIGURATION_FILE_ENDPOINT.METHOD,
      url: '/configuration/validMicrolcConfig',
    })
    expect(JSON.parse(authenticationContent.body)).toMatchObject(validAuthenticationConfig)
    expect(JSON.parse(configurationContent.body)).toMatchObject(validMicrolcConfig)
    expect(configurationFileContent.statusCode).toBe(404)
  })

  test('Fastify fail for bad auth config path', async() => {
    const fastifySetup = async() => {
      await setupFastify({
        AUTHENTICATION_CONFIGURATION_PATH: path.join(__dirname, 'notExisting.json'),
        MICROLC_CONFIGURATION_PATH: path.join(__dirname, '/configurationMocks/validMicrolcConfig.json'),
      })
    }
    await expect(fastifySetup()).rejects.toThrow()
  })

  test('Fastify fail for bad microlc config path', async() => {
    const fastifySetup = async() => {
      await setupFastify({
        AUTHENTICATION_CONFIGURATION_PATH: path.join(__dirname, '/configurationMocks/validAuthenticationConfig.json'),
        MICROLC_CONFIGURATION_PATH: path.join(__dirname, 'notExisting.json'),
      })
    }
    await expect(fastifySetup()).rejects.toThrow()
  })

  test('Fastify correctly return configuration file', async() => {
    await setupFastify({
      AUTHENTICATION_CONFIGURATION_PATH: path.join(__dirname, '/configurationMocks/validAuthenticationConfig.json'),
      MICROLC_CONFIGURATION_PATH: path.join(__dirname, '/configurationMocks/validMicrolcConfig.json'),
      PLUGINS_CONFIGURATIONS_PATH: path.join(__dirname, '/configurationMocks'),
    })
    expect(fastify).not.toBeNull()
    const configurationFileContent = await fastify.inject({
      method: CONFIGURATION_FILE_ENDPOINT.METHOD,
      url: '/configuration/validMicrolcConfig',
    })
    expect(JSON.parse(configurationFileContent.body)).toMatchObject(validMicrolcConfig)
  })
})
