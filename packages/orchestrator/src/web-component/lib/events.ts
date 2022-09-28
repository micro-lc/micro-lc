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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
// eslint-disable-next-line @typescript-eslint/no-empty-function
export function createSubject<T>(): Subject<T> {}


// const user = new CustomEvent('micro-user', { detail: elem.dataset.time })

// function addEventListener(this: HTMLElement) {
//   this.addEventListener('')
// }


// const aa = new Microlc<BaseExtension & {user: Bus<Record<string, unknown>> & {getCurrentUser: () => Record<string, unknown>}}>()

// class EventBus implements Bus {
//   asObservable: () => void
//   subscribe: (callback: (...args: unknown[]) => void) => void
//   next: (T: unknown) => void
// }

// aa.getApi().setExtension('user', new EventBus().asObservable())
// aa.getApi().setExtension('user', (new BehaviorSubject<string>('asd') as Subject<string>).asObservable())


// function asd(bus: Subject<string>): Subject<string> {
//   return bus
// }

// asd(new ReplaySubject<string>())
