import {DecoratedFastify} from '@mia-platform/custom-plugin-lib'

import {AUTHENTICATION_ENDPOINT} from './constants'
import {authenticationApiHandler, authenticationApiSchema} from './authenticationApi'

const customService = require('@mia-platform/custom-plugin-lib')()

module.exports = customService(async function index(service: DecoratedFastify) {
  service.addRawCustomPlugin(
    AUTHENTICATION_ENDPOINT.METHOD, AUTHENTICATION_ENDPOINT.PATH, authenticationApiHandler, authenticationApiSchema
  )
})
