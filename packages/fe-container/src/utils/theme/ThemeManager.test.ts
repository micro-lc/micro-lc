import {manageTheming} from './ThemeManager'

import {COLORS} from '@constants'

describe('ThemeManager tests', () => {
  afterEach(() => {
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
