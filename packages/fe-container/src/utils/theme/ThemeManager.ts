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
import tinycolor from 'tinycolor2'
import {Configuration} from '@mia-platform/core'
import {COLORS} from '@constants'

const MENU_ENTRY_ALPHA = 0.2

export const manageTheming = (configuration: Configuration) => {
  document.title = configuration.theming?.header?.pageTitle || document.title
  const primaryColor = configuration.theming?.variables.primaryColor
  setCssProperty(COLORS.primaryColor, primaryColor)
  setCssProperty(COLORS.menuEntrySelectedBackgroundColor, applyColorAlpha(primaryColor, MENU_ENTRY_ALPHA))
}

const applyColorAlpha = (colorValue: string | undefined, alphaValue: number) => {
  const propertyColor = tinycolor(colorValue)
  if (propertyColor.isValid()) {
    propertyColor.setAlpha(alphaValue)
  }
  return propertyColor.toRgbString()
}

const setCssProperty = (propertyName: string, colorValue: string | undefined) => {
  const propertyColor = tinycolor(colorValue)
  const propertyToApply = propertyColor.isValid() ? propertyColor.toString() : getComputedStyle(document.documentElement).getPropertyValue(propertyName)
  document.documentElement.style.setProperty(propertyName, propertyToApply)
}
