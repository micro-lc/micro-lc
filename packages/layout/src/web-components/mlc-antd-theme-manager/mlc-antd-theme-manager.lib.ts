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
import { generate } from '@ant-design/colors'
import { TinyColor } from '@ctrl/tinycolor'

import type { MlcAntdThemeManager } from './mlc-antd-theme-manager'

const formatColor = (color: TinyColor, updater?: (cloneColor: TinyColor) => TinyColor | undefined) => {
  let clone = color.clone()
  clone = updater?.(clone) ?? clone
  return clone.toRgbString()
}

const fillColor = (accVariables: Record<string, string>, colorString: string, type: string) => {
  const baseColor = new TinyColor(colorString)
  const colorPalettes = generate(baseColor.toRgbString())

  accVariables[`${type}-color`] = formatColor(baseColor)
  accVariables[`${type}-color-disabled`] = colorPalettes[1]
  accVariables[`${type}-color-hover`] = colorPalettes[4]
  accVariables[`${type}-color-active`] = colorPalettes[6]
  accVariables[`${type}-color-outline`] = baseColor.clone().setAlpha(0.2).toRgbString()
  accVariables[`${type}-color-deprecated-bg`] = colorPalettes[0]
  accVariables[`${type}-color-deprecated-border`] = colorPalettes[2]
}

export function createVariables(this: MlcAntdThemeManager): Record<string, string> {
  const variables: Record<string, string> = {}

  fillColor(variables, this.primaryColor, 'primary')

  const primaryColor = new TinyColor(this.primaryColor)
  const primaryColors = generate(primaryColor.toRgbString())

  primaryColors.forEach((color, index) => { variables[`primary-${index + 1}`] = color })

  variables['primary-color-deprecated-l-35'] = formatColor(primaryColor, color => color.lighten(35))
  variables['primary-color-deprecated-l-20'] = formatColor(primaryColor, color => color.lighten(20))
  variables['primary-color-deprecated-t-20'] = formatColor(primaryColor, color => color.tint(20))
  variables['primary-color-deprecated-t-50'] = formatColor(primaryColor, color => color.tint(50))
  variables['primary-color-deprecated-f-12'] = formatColor(primaryColor, color => color.setAlpha(color.getAlpha() * 0.12))

  const primaryActiveColor = new TinyColor(primaryColors[0])
  variables['primary-color-active-deprecated-f-30'] = formatColor(primaryActiveColor, color => color.setAlpha(color.getAlpha() * 0.3))
  variables['primary-color-active-deprecated-d-02'] = formatColor(primaryActiveColor, color => color.darken(2))

  fillColor(variables, this.successColor, 'success')
  fillColor(variables, this.warningColor, 'warning')
  fillColor(variables, this.errorColor, 'error')
  fillColor(variables, this.infoColor, 'info')

  variables['font-family'] = this.fontFamily

  const prefixes = Array.isArray(this.varsPrefix) ? this.varsPrefix : [this.varsPrefix]
  const variablesKeys = Object.keys(variables)

  return prefixes.reduce<Record<string, string>>((style, currPrefix) => {
    const currPrefixVariables = variablesKeys.reduce<Record<string, string>>((vars, currKey) => {
      vars[`--${currPrefix}-${currKey}`] = variables[currKey]
      return vars
    }, {})

    return { ...style, ...currPrefixVariables }
  }, {})
}
