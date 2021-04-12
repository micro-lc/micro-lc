import customService, {DecoratedFastify} from '@mia-platform/custom-plugin-lib'

import {AUTHENTICATION_ENDPOINT, CONFIGURATION_ENDPOINT} from './constants'
import {authenticationApiHandlerBuilder, authenticationApiSchema} from './authenticationApi'
import {configurationApiHandlerBuilder, configurationApiSchema} from './configurationApi'
import {environmentVariablesSchema} from './environmentVariablesSchema'

const enrichedCustomService = customService(environmentVariablesSchema)(async function index(service: DecoratedFastify) {
  const authenticationApiHandler = await authenticationApiHandlerBuilder(service)
  const configurationApiHandler = await configurationApiHandlerBuilder(service)
  service.addRawCustomPlugin(
    AUTHENTICATION_ENDPOINT.METHOD, AUTHENTICATION_ENDPOINT.PATH, authenticationApiHandler, authenticationApiSchema
  )
  service.addRawCustomPlugin(
    CONFIGURATION_ENDPOINT.METHOD, CONFIGURATION_ENDPOINT.PATH, configurationApiHandler, configurationApiSchema
  )
})

export default enrichedCustomService
