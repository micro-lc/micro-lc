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
  const primaryColor = retrievePrimaryColor(configuration)
  if (primaryColor) {
    setCssProperty(COLORS.primaryColor, primaryColor)
    setCssProperty(COLORS.tint89Color, calculateColorTint(primaryColor, MENU_ENTRY_TINT_WEIGHT))
  }
}

export const switchTheme = () => {
  toggleTheme()
  togglePrimaryColor()
}

const retrievePrimaryColor = (configuration: Configuration) => {
  let primaryColor
  try {
    primaryColor = new Value(configuration.theming?.variables.primaryColor)
  } catch (e) {
    primaryColor = undefined
  }
  return primaryColor
}

const calculateColorTint = (color: any, tintWeight: number) => {
  return color.tint(tintWeight)
}

const setCssProperty = (propertyName: string, color: any) => {
  const valueToApply = color.hexString()
  document.documentElement.style.setProperty(propertyName, valueToApply)
}

const toggleTheme = () => {
  const dataThemeValue = document.documentElement.getAttribute('data-theme')
  const dataThemeNew = dataThemeValue === 'dark' ? '' : 'dark'
  document.documentElement.setAttribute('data-theme', dataThemeNew)
}

const togglePrimaryColor = () => {
  const primaryColor = getCssColorProperty(COLORS.primaryColor)
  const tintColor = getCssColorProperty(COLORS.tint89Color)
  setCssProperty(COLORS.primaryColor, tintColor)
  setCssProperty(COLORS.tint89Color, primaryColor)
}

const getCssColorProperty = (propertyName: string) => {
  const colorValue = getComputedStyle(document.documentElement).getPropertyValue(propertyName)
  return new Value(colorValue)
}
