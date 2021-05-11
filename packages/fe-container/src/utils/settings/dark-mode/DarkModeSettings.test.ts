import {retrieveDarkModeSettings, toggleDarkModeSettings} from '@utils/settings/dark-mode/DarkModeSettings'
import {STORAGE_KEY} from '@constants'

describe('Analytics Settings Manager tests', () => {
  afterEach(() => window.localStorage.clear())

  it('Dark mode not enabled', () => {
    expect(retrieveDarkModeSettings()).not.toBeTruthy()
  })

  it('Dark mode toggled', () => {
    expect(retrieveDarkModeSettings()).not.toBeTruthy()
    toggleDarkModeSettings()
    expect(retrieveDarkModeSettings()).toBeTruthy()
    toggleDarkModeSettings()
    expect(retrieveDarkModeSettings()).not.toBeTruthy()
  })

  it('Dark mode enabled', () => {
    window.localStorage.setItem(STORAGE_KEY.CURRENT_THEME, 'true')
    expect(retrieveDarkModeSettings()).toBeTruthy()
  })

  it('Dark mode disabled', () => {
    window.localStorage.setItem(STORAGE_KEY.CURRENT_THEME, 'false')
    expect(retrieveDarkModeSettings()).not.toBeTruthy()
  })
})
