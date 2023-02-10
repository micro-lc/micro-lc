/* This routine will test the JSON files inside of schemas folders against the corresponded schema */
import { readdirSync, readFileSync } from 'fs'
import { resolve } from 'path'

import type { SchemaObject } from 'ajv'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import { expect } from 'chai'
import { globSync } from 'glob'

import { loadSchemas } from './utils'

const CONFIG_SCHEMA_NAME = 'config.schema.json'

describe('Test schemas', () => {
  const schemasDirPath = resolve(__dirname, '..', 'schemas')

  const schemasDirectoryContent = readdirSync(schemasDirPath, { withFileTypes: true })
  const schemasDirectoriesNames = schemasDirectoryContent.filter(dirent => dirent.isDirectory()).map(({ name }) => name)

  schemasDirectoriesNames.forEach(schemasDirectoryName => {
    describe(`/schemas/${schemasDirectoryName}/config.schema.json`, () => {
      const directoryAbsPath = resolve(schemasDirPath, schemasDirectoryName)
      const schemasAbsolutePaths = globSync(`${directoryAbsPath}/**/*.schema.json`)

      const loadedSchemas = loadSchemas(schemasAbsolutePaths)

      const configSchema = loadedSchemas.find(({ absPath }) => absPath.includes(CONFIG_SCHEMA_NAME))?.schema

      const auxiliarySchemas = loadedSchemas
        .filter(({ absPath }) => !absPath.includes(CONFIG_SCHEMA_NAME))
        .map(({ schema: auxiliarySchema }) => auxiliarySchema)

      const ajv = addFormats(new Ajv())
      ajv.addSchema(auxiliarySchemas)

      const validate = ajv.compile(configSchema as SchemaObject)

      const testFilesAbsolutePaths = globSync(`${directoryAbsPath}/__tests__/*.json`)

      testFilesAbsolutePaths.forEach(testFilePath => {
        const testFileName = testFilePath.replace(`${directoryAbsPath}/__tests__/`, '')

        it(testFileName, () => {
          const testFileBuffer = readFileSync(testFilePath)
          const testJson = JSON.parse(testFileBuffer.toString()) as SchemaObject

          const isValid = validate(testJson)
          expect(isValid, JSON.stringify(validate.errors)).to.be.true
        })
      })
    })
  })
})
