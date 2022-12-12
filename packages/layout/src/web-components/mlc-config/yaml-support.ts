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

import * as monaco from './monaco'

export const modelUri = monaco.Uri.parse('a://b/foo.yaml')
export const yaml = {
  ...jsYaml,
  dump: (text: string): string => {
    try {
      const value = JSON.parse(text) as unknown
      return jsYaml.dump(value, { schema: jsYaml.JSON_SCHEMA })
    } catch {
      return jsYaml.dump(text, { schema: jsYaml.JSON_SCHEMA })
    }
  },
  load: (content: string): unknown => jsYaml.load(content, { json: true, schema: jsYaml.JSON_SCHEMA }),
}
