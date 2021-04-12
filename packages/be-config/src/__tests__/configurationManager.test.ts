import path from 'path'

import {readConfigurationFile, readValidateConfiguration, validateConfigurationContent} from '../configurationManager'
import {authenticationSchema} from '@mia-platform/core'

describe('Configuration loader tests', () => {
  const configurationPath = path.join(__dirname, './validAuthenticationConfig.json')
  const invalidSchema = {
    type: 'object',
    properties: {
      isAuthNecessary: {
        type: 'string',
      },
    },
  }

  it('Correctly load configuration', async() => {
    const configContent = await readConfigurationFile(configurationPath)
    expect(configContent.isAuthNecessary).toBeTruthy()
    expect(configContent.userInfoUrl).toBe('/api/v1/microlc/user')
  })

  it('Has validated file content', async() => {
    const configContent = await readConfigurationFile(configurationPath)
    const validation = () => {
      validateConfigurationContent(configContent, authenticationSchema)
    }
    expect(validation).not.toThrow(Error)
  })

  it('Validation fail', async() => {
    const configContent = await readConfigurationFile(configurationPath)
    const validation = () => {
      validateConfigurationContent(configContent, invalidSchema)
    }
    expect(validation).toThrow(Error)
  })

  it('Correctly read and valida file', async() => {
    const configContent = await readValidateConfiguration(configurationPath, authenticationSchema)
    expect(configContent.isAuthNecessary).toBeTruthy()
    expect(configContent.userInfoUrl).toBe('/api/v1/microlc/user')
  })

  it('Validation fail on config read', async() => {
    await expect(readValidateConfiguration(configurationPath, invalidSchema)).rejects.toThrow(Error)
  })
})
