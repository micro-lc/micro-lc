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
import {MENU_LOCATION, STORAGE_KEY} from '@constants'
import {Configuration} from '@mia-platform/core'

const SIDEBAR_VALID_LOCATIONS = [undefined, MENU_LOCATION.sideBar]

export const isSideBarToShow = (configuration: Configuration): boolean => {
  return !configuration.theming || SIDEBAR_VALID_LOCATIONS.includes(configuration.theming.menuLocation)
}

export const isFixedSideBarToShow = (configuration: Configuration): boolean => {
  return configuration.theming?.menuLocation === MENU_LOCATION.fixedSideBar
}

export const isFixedSidebarCollapsed = () => {
  return localStorage.getItem(STORAGE_KEY.FIXED_SIDEBAR_STATE) === 'collapsed'
}

export const toggleFixedSidebarState = () => {
  localStorage.setItem(STORAGE_KEY.FIXED_SIDEBAR_STATE, isFixedSidebarCollapsed() ? 'expanded' : 'collapsed')
}
