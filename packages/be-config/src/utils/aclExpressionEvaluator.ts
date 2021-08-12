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
import {JSONPath} from 'jsonpath-plus'
import {applyOperation, Operation} from 'fast-json-patch'

import {GROUPS_CONFIGURATION} from '../constants'

type UserGroupsObject = {
  [key: string]: boolean
}

type FilterableObject = {
  aclExpression: string
}

const userGroupsObjectBuilder = (userGroups: string[]) => {
  const userGroupsObject: UserGroupsObject = {}
  for (const userGroup of userGroups) {
    userGroupsObject[userGroup] = true
  }
  return userGroupsObject
}

const buildPluginFunction = (plugin: FilterableObject) => {
  // eslint-disable-next-line no-new-func
  return new Function(GROUPS_CONFIGURATION.function.key, `return !!(${plugin.aclExpression})`)
}

const evaluatePluginExpression = (userGroupsObject: UserGroupsObject) => {
  return (plugin: FilterableObject) => {
    const expressionEvaluationFunction = buildPluginFunction(plugin)
    return expressionEvaluationFunction(userGroupsObject)
  }
}

const jsonPathCallback = (valuesToAvoid: string[], expressionEvaluator: Function) => (payload: any, payloadType: any, fullPayload: any) => {
  if (!expressionEvaluator(fullPayload.value)) {
    valuesToAvoid.push(payload)
  }
}

const patchCreator = (valueToAvoid: string): Operation => ({
  op: 'remove',
  path: valueToAvoid,
})

export const aclExpressionEvaluator = (jsonToFilter: any, userGroups: string[]) => {
  const userGroupsObject = userGroupsObjectBuilder(userGroups)
  const expressionEvaluator = evaluatePluginExpression(userGroupsObject)
  const valuesToAvoid: string[] = []
  const pathCallback = jsonPathCallback(valuesToAvoid, expressionEvaluator)
  do {
    valuesToAvoid.splice(0)
    JSONPath({path: '$..aclExpression^', json: jsonToFilter, resultType: 'pointer', callback: pathCallback})
    const [patchToApply] = valuesToAvoid
    patchToApply && applyOperation(jsonToFilter, patchCreator(patchToApply))
  } while (valuesToAvoid.length !== 0)
  return jsonToFilter
}
