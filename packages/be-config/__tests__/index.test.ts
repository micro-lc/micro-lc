'use strict'

import {FastifyInstance} from "fastify"

export interface ProcessEnv {
  [key: string]: string | undefined
}

describe('mia_template_service_name_placeholder', () => {
  const lc39 = require('@mia-platform/lc39')

  let fastify: FastifyInstance

  async function setupFastify(envVariables: ProcessEnv): Promise<FastifyInstance> {
    const fastify = await lc39('src/index.ts', {
      logLevel: 'silent',
      envVariables,
    })
    return fastify
  }

  beforeAll(async () => {
    fastify = await setupFastify({
      USERID_HEADER_KEY: 'userid',
      GROUPS_HEADER_KEY: 'groups',
      CLIENTTYPE_HEADER_KEY: 'clienttype',
      BACKOFFICE_HEADER_KEY: 'backoffice',
      MICROSERVICE_GATEWAY_SERVICE_NAME: 'microservice-gateway.example.org',
    })
  });

  afterAll(async () => {
    await fastify.close()
  })

  /*
  * Insert your tests here.
  */
  test('Insert test name here', () => {

  })
})
