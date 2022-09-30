import type { BaseExtension } from '@micro-lc/orchestrator'

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

export interface MlcLayoutMicrolcApiExtension {
  user?: {
    getUser: () => Record<string, unknown>
  }
}

export type MicrolcApiExtension = BaseExtension & MlcLayoutMicrolcApiExtension
  // TODO: remove httpClient override when typing is available
  & { httpClient: { get: (url: string) => Promise<Record<string, unknown>> } }


