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
import {authenticationSchema} from '@mia-platform/core'

import {readJsonConfigurationFile, readValidateConfiguration, validateConfigurationContent} from '../configurationManager'

describe('Configuration loader tests', () => {
  const configurationPath = path.join(__dirname, '../../__tests__/configurationMocks/validAuthenticationConfig.json')
  const invalidSchema = {
    type: 'object',
    properties: {
      isAuthNecessary: {
        type: 'string',
      },
    },
  }

  it('Correctly load configuration', async() => {
    const configContent = await readJsonConfigurationFile(configurationPath)
    expect(configContent.isAuthNecessary).toBeTruthy()
    expect(configContent.userInfoUrl).toBe('/api/v1/microlc/user')
  })

  it('Has validated file content', async() => {
    const configContent = await readJsonConfigurationFile(configurationPath)
    const validation = () => {
      validateConfigurationContent(configContent, authenticationSchema)
    }
    expect(validation).not.toThrow(Error)
  })

  it('Validation fail', async() => {
    const configContent = await readJsonConfigurationFile(configurationPath)
    const validation = () => {
      validateConfigurationContent(configContent, invalidSchema)
    }
    expect(validation).toThrow(Error)
  })

  it('Correctly read and validate file', async() => {
    const configContent = await readValidateConfiguration(configurationPath, authenticationSchema)
    expect(configContent.isAuthNecessary).toBeTruthy()
    expect(configContent.userInfoUrl).toBe('/api/v1/microlc/user')
  })

  it('Validation fail on config read', async() => {
    await expect(readValidateConfiguration(configurationPath, invalidSchema)).rejects.toThrow(Error)
  })
})
