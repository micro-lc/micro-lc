import type { LoadableApp } from 'qiankun'

import type { BaseExtension, QiankunMicroApp } from './apis'
import type Microlc from './apis'
import type { ComposableApplicationProperties } from './apis/micro-lc.lib'

let originalPushState: typeof window.history.pushState | undefined
let originalReplaceState: typeof window.history.replaceState | undefined

let currentApplication: string | undefined
const applicationHandlers = new Map<string, QiankunMicroApp>()

export function rerouteErrorHandler(err: TypeError) {
  console.error(err)
}

export async function reroute<T extends BaseExtension>(this: Microlc<T>, url?: string | URL) {
  let unmount: (() => Promise<null>) | undefined
  if (currentApplication) {
    const runningApp = applicationHandlers.get(currentApplication)
    unmount = runningApp?.unmount.bind(runningApp)
  }

  const { pathname } = url ? new URL(url, window.location.origin) : window.location

  let handlers: QiankunMicroApp | undefined
  let bestMatch: LoadableApp<ComposableApplicationProperties<T>> | undefined
  for (const [route, args] of this._loadedApps.values()) {
    const matchArray = pathname.match(new RegExp(route))
    if (matchArray) {
      bestMatch = args
    }
  }

  if (bestMatch) {
    currentApplication = bestMatch.name
    handlers = applicationHandlers.get(currentApplication)
    if (handlers === undefined) {
      handlers = this._qiankun.loadMicroApp(bestMatch)
      applicationHandlers.set(currentApplication, handlers)
    }
  } else {
    throw new TypeError('not found')
  }

  if (handlers) {
    await unmount?.()
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await handlers.bootstrapPromise.then(() => handlers!.mount())
  }
}

function popStateListener<T extends BaseExtension>(this: Microlc<T>, event: PopStateEvent): void {
  const target = (event.target ?? window) as Window
  this._reroute(target.location.href).catch(rerouteErrorHandler)
}

function domContentLoaded(this: Window, event: Event) {
  console.log(event)
}

let popstate: ((ev: PopStateEvent) => unknown) | undefined
let domcontent: ((ev: Event) => unknown) | undefined

export function createRouter<T extends BaseExtension>(this: Microlc<T>) {
  popstate = popStateListener.bind<(event: PopStateEvent) => void>(this)
  domcontent = domContentLoaded.bind<(event: Event) => void>(this)
  window.addEventListener('popstate', popstate)
  window.addEventListener('DOMContentLoaded', domContentLoaded)

  originalPushState = window.history.pushState.bind(window.history)
  originalReplaceState = window.history.replaceState.bind(window.history)

  window.history.pushState = (data: unknown, unused: string, url?: string | URL): void => {
    this._reroute(url).catch(rerouteErrorHandler)
    originalPushState?.(data, unused, url)
  }

  window.history.replaceState = (data: unknown, unused: string, url?: string | URL): void => {
    this._reroute(url).catch(rerouteErrorHandler)
    originalReplaceState?.(data, unused, url)
  }
}

export function removeRouter() {
  originalPushState && (window.history.pushState = originalPushState)
  originalReplaceState && (window.history.replaceState = originalReplaceState)
  popstate && window.removeEventListener('popstate', popstate)
  domcontent && window.removeEventListener('DOMContentLoaded', domcontent)
}
