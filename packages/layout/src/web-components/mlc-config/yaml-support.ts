import { setDiagnosticsOptions } from 'monaco-yaml'

import { Uri } from './worker'

export const modelUri = Uri.parse('a://b/foo.yaml')

setDiagnosticsOptions({
  completion: true,
  enableSchemaRequest: true,
  format: true,
  hover: true,
  schemas: [
    {
      fileMatch: [String(modelUri)],
      schema: {
        properties: {
          p1: {
            enum: ['v1', 'v2'],
          },
          p2: {
            // Reference the second schema
            $ref: 'http://myserver/bar-schema.json',
          },
        },
        type: 'object',
      },
      uri: 'http://myserver/foo-schema.json',
    },
    {
      fileMatch: [String(modelUri)],
      schema: {
        properties: {
          q1: {
            enum: ['x1', 'x2'],
          },
        },
        type: 'object',
      },
      uri: 'http://myserver/bar-schema.json',
    },
  ],
  validate: true,
})
