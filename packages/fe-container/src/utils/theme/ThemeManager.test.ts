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
import {manageTheming} from './ThemeManager'

import {COLORS} from '@constants'

describe('ThemeManager tests', () => {
  afterEach(() => {
    document.title = ''
    document.documentElement.style.setProperty(COLORS.primaryColor, null)
    document.documentElement.style.setProperty(COLORS.menuEntrySelectedBackgroundColor, null)
  })

  const configuration = {
    theming: {
      header: {
        pageTitle: 'Mia Care',
        favicon: 'https://www.mia-platform.eu/static/img/favicon/apple-icon-60x60.png'
      },
      variables: {
        primaryColor: 'red'
      },
      logo: {
        alt: 'alt-logo',
        url: 'logo_url'
      }
    },
    plugins: []
  }

  it('Document title applied', () => {
    expect(document.title).toBe('')
    manageTheming(configuration)
    expect(document.title).toBe('Mia Care')
  })

  it('Document title is not applied', () => {
    expect(document.title).toBe('')
    manageTheming({
      theming: {
        header: {},
        variables: {},
        logo: {
          alt: 'alt-logo',
          url: 'logo_url'
        }
      },
      plugins: []
    })
    expect(document.title).toBe('')
  })

  it('Compute primary color and its derived', () => {
    manageTheming(configuration)
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue(COLORS.primaryColor)
    expect(primaryColor).toBe('red')
    const menuEntryColor = getComputedStyle(document.documentElement).getPropertyValue(COLORS.menuEntrySelectedBackgroundColor)
    expect(menuEntryColor).toBe('rgba(255, 0, 0, 0.2)')
  })

  it('Return emtpy and black for invalid color', () => {
    const invalidColorConfiguration = {
      theming: {
        header: {
          pageTitle: 'Mia Care',
          favicon: 'https://www.mia-platform.eu/static/img/favicon/apple-icon-60x60.png'
        },
        variables: {
          primaryColor: 'blallo'
        },
        logo: {
          alt: 'alt-logo',
          url: 'logo_url'
        }
      },
      plugins: []
    }
    manageTheming(invalidColorConfiguration)
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue(COLORS.primaryColor)
    expect(primaryColor).toBe('')
    const menuEntryColor = getComputedStyle(document.documentElement).getPropertyValue(COLORS.menuEntrySelectedBackgroundColor)
    expect(menuEntryColor).toBe('rgb(0, 0, 0)')
  })
})
