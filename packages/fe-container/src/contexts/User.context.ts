import {createContext} from 'react'
import {User} from '@mia-platform/core'

export const UserContext = createContext<Partial<User>>({})
export const UserContextProvider = UserContext.Provider
