import type { ConfigSchema as V2 } from '../schemas/v2/schema'

export type Latest = V2

export type Version = 'v1' | 'v2'

export interface IntakeOptions {
  to?: Version
}

export interface Context extends IntakeOptions{
  console: boolean
  files: string[]
}
