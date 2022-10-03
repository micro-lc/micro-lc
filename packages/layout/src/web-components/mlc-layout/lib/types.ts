import type { BaseExtension, MicrolcApi } from '@micro-lc/orchestrator'

export interface User {
  avatar?: string
  name?: string
}

export type VoidFn = () => void

export enum Theme {
  DARK = 'dark',
  LIGHT = 'light'
}

export type OnThemeChange = (newTheme: Theme) => void

interface MlcApiEvent {
  [key: string]: unknown
  theme: Theme
  user: Record<string, unknown>
}

export type MlcApi = MicrolcApi<BaseExtension, MlcApiEvent>
