import type { ErrorCodes, ErrorHandler } from './errors'

export function error(message: ErrorCodes | string, ...args: string[]) {
  if (process.env.NODE_ENV === 'development') {
    import('./errors').then(({ default: errorMap }) => {
      const handler = errorMap[message as ErrorCodes] as ErrorHandler | undefined
      handler
        ? console.error(handler(...args))
        : console.error(...args)
    }).catch((err: TypeError) => {
      console.error(
        `[micro-lc]: Dynamic import error - ${err.message}`
      )
    })
  }
}
