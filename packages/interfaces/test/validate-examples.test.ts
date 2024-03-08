import { readdirSync } from 'fs'
import { dirname, resolve } from 'path'

import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import { expect } from 'chai'
import { globSync } from 'glob'

import type { SchemaWithDefinitions } from './utils'
import { loadSchemas } from './utils.js'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

interface TestCase {
  example: unknown
  subSchema: SchemaWithDefinitions
  subSchemaPath: string[]
}

const extractTestCases = (currSchemaNode: unknown, acc: TestCase[], path: string[] = []) => {
  if (currSchemaNode === null || typeof currSchemaNode !== 'object') { return }

  if (Array.isArray(currSchemaNode)) {
    currSchemaNode.forEach((currSchemaNodeElement, idx) => extractTestCases(currSchemaNodeElement, acc, [...path, idx.toString()]))
    return
  }

  Object
    .entries(currSchemaNode)
    .reduce((subAcc, [key, value]) => {
      if (key === 'examples') {
        (value as unknown[]).forEach((example, idx) => {
          subAcc.push({
            example,
            subSchema: currSchemaNode,
            subSchemaPath: [...path, key, idx.toString()],
          })
        })
      }

      if (typeof value === 'object') { extractTestCases(value, subAcc, [...path, key]) }

      return subAcc
    }, acc)
}

/* This routine will validate each schema in the "schemas" folder checking their examples against their own sub-schemas */
describe('Validate schemas examples', () => {
  const schemasDirPath = resolve(__dirname, '..', 'schemas')

  const schemasDirectoryContent = readdirSync(schemasDirPath, { withFileTypes: true })
  const schemasDirectoriesNames = schemasDirectoryContent.filter(dirent => dirent.isDirectory()).map(({ name }) => name)

  schemasDirectoriesNames.forEach(schemasDirectoryName => {
    describe(`/schemas/${schemasDirectoryName}`, () => {
      const directoryAbsPath = resolve(schemasDirPath, schemasDirectoryName)
      const schemasAbsolutePaths = globSync(`${directoryAbsPath}/**/*.schema.json`)

      const loadedSchemas = loadSchemas(schemasAbsolutePaths)

      loadedSchemas.forEach(({ absPath: schemaPath, schema, id: schemaId }) => {
        const schemaName = schemaPath.replace(directoryAbsPath, '')

        describe(schemaName, () => {
          // Every other schema in the directory. They need to be loaded in Ajv since they may be referenced in the current schema
          const auxiliarySchemas = loadedSchemas.filter(({ id }) => schemaId !== id).map(({ schema: auxiliarySchema }) => auxiliarySchema)

          const { $id: originalId, definitions: originalDefinitions } = schema

          const testCases: TestCase[] = []
          extractTestCases(schema, testCases)

          testCases.forEach(({ example, subSchema, subSchemaPath }) => {
            const testName = `#${subSchemaPath.join('/')}`

            it(testName, () => {
              const ajv = addFormats(new Ajv())
              ajv.addSchema(auxiliarySchemas)

              const restoredSubSchema = { ...subSchema, $id: originalId, definitions: originalDefinitions }

              const validate = ajv.compile(restoredSubSchema)

              expect(validate(example), JSON.stringify(validate.errors)).to.be.true
            })
          })
        })
      })
    })
  })
})
