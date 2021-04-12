import {DecoratedFastify} from '@mia-platform/custom-plugin-lib'

import {AUTHENTICATION_ENDPOINT} from './constants'
import {authenticationApiHandlerBuilder, authenticationApiSchema} from './authenticationApi'

const customService = require('@mia-platform/custom-plugin-lib')()

const enrichedCustomService = customService(async function index(service: DecoratedFastify) {
  const authenticationApiHandler = await authenticationApiHandlerBuilder(service)
  service.addRawCustomPlugin(
    AUTHENTICATION_ENDPOINT.METHOD, AUTHENTICATION_ENDPOINT.PATH, authenticationApiHandler, authenticationApiSchema
  )
})

export default enrichedCustomService
