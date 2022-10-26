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
import type { UserMenu } from '../types'

export const mapUserFields = (userInfo: Record<string, unknown>, userConfig?: Partial<UserMenu>): Record<string, unknown> => {
  const { userPropertiesMapping } = userConfig ?? {}

  if (!userPropertiesMapping) { return userInfo }

  return Object
    .entries(userInfo)
    .reduce<Record<string, unknown>>((mappedUser, [key, value]) => {
      return {
        ...mappedUser,
        [userPropertiesMapping[key] || key]: value,
      }
    }, {})
}
