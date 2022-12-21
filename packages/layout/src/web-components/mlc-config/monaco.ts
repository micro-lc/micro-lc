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
import schemaUrl from '@micro-lc/interfaces/schemas/v2/config.schema.json?url'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { setDiagnosticsOptions } from 'monaco-yaml'

import './monaco-contrib'
/**
 * CAUTION: storybook replaces the import here 👇
 */
import './worker'

export type Monaco = typeof monaco
export type { editor as Editor } from 'monaco-editor'

monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
  enableSchemaRequest: true,
  schemas: [
    {
      fileMatch: ['**/*.json'],
      uri: `${schemaUrl}#`,
    },
  ],
  validate: true,
})

setDiagnosticsOptions({
  enableSchemaRequest: true,
  schemas: [
    {
      fileMatch: ['**/*.yaml', '**/*.yml'],
      uri: `${schemaUrl}#`,
    },
  ],
})

export * from 'monaco-editor/esm/vs/editor/editor.api'
