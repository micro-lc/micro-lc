export interface Subscription {
  readonly closed: boolean
  unsubscribe(): void
}

export interface Observable<T> {
  subscribe: (next: (value: T) => void) => Subscription
}

export interface Subject<T> extends Observable<T> {
  asObservable: () => Observable<T>
  next: (value: T) => void
}

export type MicrolcEvent = Record<string, unknown>
