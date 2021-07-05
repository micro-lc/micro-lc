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

const mutateJson = require('mutant-json')

const retrieveParentObject = (path: string, originalObject: any) => {
  let parentObject = originalObject
  path
    .split('/')
    .slice(1, -1)
    .forEach((key: string) => {
      parentObject = parentObject[key]
    })
  return parentObject
}

const mutantProcess = ($ref: any) => (mutate: Function, value: any, path: string, originalObject: any) => {
  const parentObject = retrieveParentObject(path, originalObject)
  Object.assign(parentObject, $ref[value])
  mutate({
    op: 'remove',
    value,
  })
}

const mutantOptions = {
  nested: true,
  test: /\$ref/,
  promises: false,
}

const replace = ({$ref, content}: any) => {
  return mutateJson(content, mutantProcess($ref), mutantOptions)
}

export const referencesReplacer = (configuration: any) => {
  const isReplaceable = configuration.$ref && configuration.content
  return isReplaceable ? replace(configuration) : configuration
}
