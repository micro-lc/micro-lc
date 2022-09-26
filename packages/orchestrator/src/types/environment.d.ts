import type { MicrolcApi } from '../apis'

export {}

declare global {
  interface Window {
    getMicrolcApi?: () => MicrolcApi
  }

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test'
    }
  }
}
