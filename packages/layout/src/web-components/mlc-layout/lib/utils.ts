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
import type { MenuItem } from '../types'

export enum Theme {
  DARK = 'dark',
  LIGHT = 'light'
}

export const findMenuItemById = (
  menuItems: Partial<MenuItem>[],
  id: string
): Partial<MenuItem> | undefined => {
  for (const menuItem of menuItems) {
    if (menuItem.id === id) { return menuItem }

    if ('children' in menuItem) {
      const foundInChildren = findMenuItemById(menuItem.children ?? [], id)
      if (foundInChildren) { return foundInChildren }
    }
  }
}
