import {STORAGE_KEY} from '@constants'

export const retrieveDarkModeSettings = () => {
  return localStorage.getItem(STORAGE_KEY.DARK_MODE) === 'true'
}

export const toggleDarkModeSettings = () => {
  const currentDarkMode = retrieveDarkModeSettings()
  localStorage.setItem(STORAGE_KEY.DARK_MODE, currentDarkMode ? 'false' : 'true')
}
