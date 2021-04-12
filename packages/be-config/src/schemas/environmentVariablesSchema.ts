export const environmentVariablesSchema = {
  type: 'object' as 'object',
  required: ['AUTHENTICATION_CONFIGURATION_PATH', 'MICROLC_CONFIGURATION_PATH'],
  properties: {
    AUTHENTICATION_CONFIGURATION_PATH: {
      type: 'string',
      description: 'The path of the authentication configuration file',
    },
    MICROLC_CONFIGURATION_PATH: {
      type: 'string',
      description: 'The path of the microlc configuration file',
    },
  },
}
