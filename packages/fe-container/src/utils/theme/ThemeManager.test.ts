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
import {manageTheming, switchTheme} from './ThemeManager'

import {COLORS, DARK_THEME_ATTRIBUTE} from '@constants'

describe('ThemeManager tests', () => {
  afterEach(() => {
    document.title = ''
    document.documentElement.style.setProperty(COLORS.primaryColor, null)
    document.documentElement.style.setProperty(COLORS.tint89Color, null)
  })

  const configurationBuilder = (primaryColor = 'red') => {
    return {
      theming: {
        header: {
          pageTitle: 'My Company',
          favicon: 'https://www.mia-platform.eu/static/img/favicon/apple-icon-60x60.png'
        },
        variables: {
          primaryColor
        },
        logo: {
          alt: 'alt-logo',
          url_light_image: 'logo_url'
        }
      },
      plugins: []
    }
  }

  it('Document title applied', () => {
    expect(document.title).toBe('')
    manageTheming(configurationBuilder())
    expect(document.title).toBe('My Company')
  })

  it('Document title is not applied', () => {
    expect(document.title).toBe('')
    manageTheming({
      theming: {
        header: {},
        variables: {},
        logo: {
          alt: 'alt-logo',
          url_light_image: 'logo_url'
        }
      },
      plugins: []
    })
    expect(document.title).toBe('')
  })

  it('Compute primary color and its derived from string color', () => {
    manageTheming(configurationBuilder())
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue(COLORS.primaryColor)
    expect(primaryColor).toBe('#ff0000')
    const menuEntryColor = getComputedStyle(document.documentElement).getPropertyValue(COLORS.tint89Color)
    expect(menuEntryColor).toBe('#ffe3e3')
  })

  it('Compute primary color and its derived from hex color', () => {
    manageTheming(configurationBuilder('#1890ff'))
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue(COLORS.primaryColor)
    expect(primaryColor).toBe('#1890ff')
    const menuEntryColor = getComputedStyle(document.documentElement).getPropertyValue(COLORS.tint89Color)
    expect(menuEntryColor).toBe('#e6f3ff')
  })

  it('Return empty for invalid color', () => {
    manageTheming(configurationBuilder('blallo'))
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue(COLORS.primaryColor)
    expect(primaryColor).toBe('')
    const menuEntryColor = getComputedStyle(document.documentElement).getPropertyValue(COLORS.tint89Color)
    expect(menuEntryColor).toBe('')
  })

  it('Correctly switch theme', () => {
    Object.defineProperty(window, 'getComputedStyle', {
      value: jest.fn(() => ({
        getPropertyValue: () => 'red'
      }))
    })
    expect(document.documentElement.getAttribute(DARK_THEME_ATTRIBUTE)).toBeNull()
    switchTheme()
    expect(document.documentElement.getAttribute(DARK_THEME_ATTRIBUTE)).toBe('')
  })
})
