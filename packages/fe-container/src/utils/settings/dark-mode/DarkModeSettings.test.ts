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
  })

  it('Dark mode enabled', () => {
    window.localStorage.setItem(STORAGE_KEY.DARK_MODE, 'true')
    expect(retrieveDarkModeSettings()).toBeTruthy()
  })

  it('Dark mode disabled', () => {
    window.localStorage.setItem(STORAGE_KEY.DARK_MODE, 'false')
    expect(retrieveDarkModeSettings()).not.toBeTruthy()
  })
})
