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
