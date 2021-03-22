import {createContext} from 'react'
import {Configuration} from '@mia-platform/core'

export const ConfigurationContext = createContext<Configuration>({})
export const ConfigurationProvider = ConfigurationContext.Provider
