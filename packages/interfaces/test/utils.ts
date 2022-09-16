import { readFileSync } from 'fs'

import type { SchemaObject } from 'ajv/lib/types'

export type SchemaWithDefinitions = SchemaObject & { definitions?: Record<string, SchemaObject> }

interface LoadedSchema {
  absPath: string
  id: string
  schema: SchemaWithDefinitions
}

export const loadSchemas = (schemasPaths: string[]): LoadedSchema[] => {
  const loadedSchemas: LoadedSchema[] = []

  return schemasPaths.reduce((acc, currPath) => {
    const fileBuffer = readFileSync(currPath)
    const schema = JSON.parse(fileBuffer.toString()) as SchemaWithDefinitions

    return [...acc, { absPath: currPath, id: schema.$id ?? currPath, schema }]
  }, loadedSchemas)
}
