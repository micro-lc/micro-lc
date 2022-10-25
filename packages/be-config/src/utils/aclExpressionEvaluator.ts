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
import {applyOperation, Operation, deepClone} from 'fast-json-patch'

import {GROUPS_CONFIGURATION, PERMISSIONS_CONFIGURATION} from '../constants'

type UserGroupsObject = {
  [key: string]: boolean
}

type UserPermissionsObject = {
  [key: string]: boolean | object
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

const createUserPermissionsNestedObject = (originalObject: any, permissionPaths: string[]) => {
  for (let i = 0; i < permissionPaths.length; i++) {
    // eslint-disable-next-line no-param-reassign, no-multi-assign
    if (i < permissionPaths.length - 1) {
      // eslint-disable-next-line no-param-reassign, no-multi-assign
      originalObject = originalObject[permissionPaths[i]] = originalObject[permissionPaths[i]] || {}
    } else {
      // eslint-disable-next-line no-multi-assign, no-param-reassign
      originalObject = originalObject[permissionPaths[i]] = true
    }
  }
}

const userPermissionsObjectBuilder = (userPermissions: string[]) => {
  const userPermissionObject: UserPermissionsObject = {}
  for (let i = 0; i < userPermissions.length; i++) {
    const permissions = userPermissions[i].split('.')
    createUserPermissionsNestedObject(userPermissionObject, permissions)
  }
  return userPermissionObject
}

const buildPluginFunction = (plugin: FilterableObject) => {
  const bracketsNotationExpression = plugin.aclExpression.replace(/\.(.+?)(?=\.|$| |\))/g, (_, string) => `?.['${string}']`)
  const booleanEvaluationExpression = bracketsNotationExpression.replace(/'](?=]|$| )/g, `'] === true`)
  // eslint-disable-next-line no-new-func
  return new Function(GROUPS_CONFIGURATION.function.key, PERMISSIONS_CONFIGURATION.function.key, `return !!(${booleanEvaluationExpression})`)
}

const evaluatePluginExpression = (userGroupsObject: UserGroupsObject, userPermissionsObject: UserPermissionsObject) => {
  return (plugin: FilterableObject) => {
    const expressionEvaluationFunction = buildPluginFunction(plugin)
    return expressionEvaluationFunction(userGroupsObject, userPermissionsObject)
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

export const aclExpressionEvaluator = (jsonToFilter: any, userGroups: string[], userPermissions: string[]) => {
  const clonedJsonToFilter = deepClone(jsonToFilter)
  const userGroupsObject = userGroupsObjectBuilder(userGroups)
  const userPermissionsObject = userPermissionsObjectBuilder(userPermissions)
  const expressionEvaluator = evaluatePluginExpression(userGroupsObject, userPermissionsObject)
  const valuesToAvoid: string[] = []
  const pathCallback = jsonPathCallback(valuesToAvoid, expressionEvaluator)
  do {
    valuesToAvoid.splice(0)
    JSONPath({path: '$..aclExpression^', json: clonedJsonToFilter, resultType: 'pointer', callback: pathCallback})
    const [patchToApply] = valuesToAvoid
    patchToApply && applyOperation(clonedJsonToFilter, patchCreator(patchToApply))
  } while (valuesToAvoid.length !== 0)
  return clonedJsonToFilter
}
