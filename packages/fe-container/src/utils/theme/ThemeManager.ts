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

const applyColorAlpha = (propertyValue: string | undefined, alphaValue: number) => {
  const propertyColor = tinycolor(propertyValue)
  if (propertyColor.isValid()) {
    propertyColor.setAlpha(alphaValue)
  }
  return propertyColor.toRgbString()
}

const setCssProperty = (propertyName: string, propertyValue: string | undefined) => {
  const propertyColor = tinycolor(propertyValue)
  const propertyToApply = propertyColor.isValid() ? propertyColor.toString() : getComputedStyle(document.documentElement).getPropertyValue(propertyName)
  document.documentElement.style.setProperty(propertyName, propertyToApply)
}
