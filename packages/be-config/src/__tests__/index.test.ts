import {FastifyInstance} from 'fastify'

export interface ProcessEnv {
  [key: string]: string | undefined
}

describe('mia_template_service_name_placeholder', () => {
  // eslint-disable-next-line global-require
  const lc39 = require('@mia-platform/lc39')

  let fastify: FastifyInstance

  async function setupFastify(envVariables: ProcessEnv) {
    fastify = await lc39('src/index.ts', {
      logLevel: 'silent',
      envVariables,
    })
  }

  beforeAll(async() => {
    await setupFastify({
      USERID_HEADER_KEY: 'userid',
      GROUPS_HEADER_KEY: 'groups',
      CLIENTTYPE_HEADER_KEY: 'clienttype',
      BACKOFFICE_HEADER_KEY: 'backoffice',
      MICROSERVICE_GATEWAY_SERVICE_NAME: 'microservice-gateway.example.org',
    })
  })

  afterAll(async() => {
    await fastify.close()
  })

  test('Insert test name here', () => {
    // TODO
  })
})
