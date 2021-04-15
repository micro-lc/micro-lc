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
import {Configuration} from '@mia-platform/core'
// @ts-ignore
import Value from 'values.js'

import {COLORS} from '@constants'

const MENU_ENTRY_TINT_WEIGHT = 89

export const manageTheming = (configuration: Configuration) => {
  document.title = configuration.theming?.header?.pageTitle || document.title
  if (isPrimaryColorValid(configuration)) {
    const primaryColor = new Value(configuration.theming?.variables.primaryColor)
    setCssProperty(COLORS.primaryColor, primaryColor)
    setCssProperty(COLORS.menuEntrySelectedBackgroundColor, calculateColorTint(primaryColor, MENU_ENTRY_TINT_WEIGHT))
  }
}

const isPrimaryColorValid = (configuration: Configuration) => {
  let colorValid = true
  try {
    colorValid && new Value(configuration.theming?.variables.primaryColor)
  } catch (e) {
    colorValid = false
  }
  return colorValid
}

const calculateColorTint = (color: any, tintWeight: number) => {
  return color.tint(tintWeight)
}

const setCssProperty = (propertyName: string, color: any) => {
  const valueToApply = color.hexString()
  document.documentElement.style.setProperty(propertyName, valueToApply)
}
