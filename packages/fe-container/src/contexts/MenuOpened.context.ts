import {createContext} from 'react'

export const MenuOpenedContext = createContext({
  isMenuOpened: false,
  setMenuOpened: (_: boolean) => {
  }
})
export const MenuOpenedProvider = MenuOpenedContext.Provider
