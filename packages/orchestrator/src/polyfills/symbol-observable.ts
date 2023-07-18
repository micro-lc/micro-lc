export type {}

if (!Symbol.observable) {
  Object.defineProperty(Symbol, 'observable', {
    value: Symbol('observable'),
  })
}
