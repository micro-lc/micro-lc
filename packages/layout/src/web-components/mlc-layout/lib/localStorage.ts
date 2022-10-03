import type { Theme } from './types'

export interface LocalStorage {
  '@microlc:currentTheme': Theme
  '@microlc:fixedSidebarState': 'expanded' | 'collapsed'
}

export const getFromLocalStorage = <K extends keyof LocalStorage>(key: K): LocalStorage[K] | undefined => {
  return (localStorage.getItem(key) ?? undefined) as LocalStorage[K] | undefined
}

export const setInLocalStorage = <K extends keyof LocalStorage>(key: K, val: LocalStorage[K]) => {
  localStorage.setItem(key, val)
}
