/**
  Copyright 2022 Mia srl

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
import jsYaml from 'js-yaml'
import { setDiagnosticsOptions } from 'monaco-yaml'

import { Uri } from './worker'

export const modelUri = Uri.parse('a://b/foo.yaml')
export const yaml = {
  ...jsYaml,
  dump: (text: string) => jsYaml.dump(JSON.parse(text), { schema: jsYaml.JSON_SCHEMA }),
  load: (content: string): unknown => jsYaml.load(content, { json: true, schema: jsYaml.JSON_SCHEMA }),
}

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
