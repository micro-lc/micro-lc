import {STORAGE_KEY} from '@constants'

export const retrieveDarkModeSettings = () => {
  return localStorage.getItem(STORAGE_KEY.CURRENT_THEME) === 'true'
}

export const toggleDarkModeSettings = () => {
  const currentDarkMode = retrieveDarkModeSettings()
  localStorage.setItem(STORAGE_KEY.CURRENT_THEME, currentDarkMode ? 'false' : 'true')
}
