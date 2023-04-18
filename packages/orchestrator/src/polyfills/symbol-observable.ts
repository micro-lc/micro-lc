export type {}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
if (!Symbol.observable) {
  Object.defineProperty(Symbol, 'observable', {
    value: Symbol('observable'),
  })
}
