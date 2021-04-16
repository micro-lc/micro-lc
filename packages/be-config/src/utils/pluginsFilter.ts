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

import {Plugin} from '@mia-platform/core'

import {GROUPS_CONFIGURATION} from '../constants'

type UserGroupsObject = {
  [key: string]: boolean
}

const userGroupsObjectBuilder = (userGroups: string[]) => {
  const userGroupsObject: UserGroupsObject = {}
  for (const userGroup of userGroups) {
    userGroupsObject[userGroup] = true
  }
  return userGroupsObject
}

const buildPluginFunction = (plugin: Plugin) => {
  // eslint-disable-next-line no-new-func
  return new Function(GROUPS_CONFIGURATION.function.key, `return !!(${plugin.aclExpression})`)
}

const evaluatePluginExpression = (userGroupsObject: UserGroupsObject) => {
  return (plugin: Plugin) => {
    const expressionEvaluationFunction = buildPluginFunction(plugin)
    return expressionEvaluationFunction(userGroupsObject)
  }
}

export const pluginsFilter = (plugins: Plugin[], userGroups: string[]) => {
  const userGroupsObject = userGroupsObjectBuilder(userGroups)
  const pluginsWithoutExpression = plugins.filter(plugin => !plugin.aclExpression)
  const pluginsWithAclExpression = plugins
    .filter(plugin => plugin.aclExpression)
    .filter(evaluatePluginExpression(userGroupsObject))
  return [...pluginsWithoutExpression, ...pluginsWithAclExpression]
}
