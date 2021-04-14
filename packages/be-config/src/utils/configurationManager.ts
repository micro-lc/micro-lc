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

import util from 'util'
import fs from 'fs'
import Ajv from 'ajv'

const readFileAsync = util.promisify(fs.readFile)

export const readConfigurationFile = async(configurationPath: string) => {
  const fileContent = await readFileAsync(configurationPath)
  return JSON.parse(fileContent.toString('utf-8'))
}

export const validateConfigurationContent = (configurationContent: any, configurationSchema: any) => {
  const configValidator = new Ajv().compile(configurationSchema)
  const isConfigValid = configValidator(configurationContent)
  if (!isConfigValid) {
    throw new Error(`Invalid configuration: ${JSON.stringify(configValidator.errors)}`)
  }
}

export const readValidateConfiguration = async(configurationPath: string, configurationSchema: any) => {
  const configurationContent = await readConfigurationFile(configurationPath)
  validateConfigurationContent(configurationContent, configurationSchema)
  return configurationContent
}
