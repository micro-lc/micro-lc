import type { LoadableApp } from 'qiankun'
import { BehaviorSubject } from 'rxjs'

import type { ErrorCodes } from '../../logger'
import logger from '../../logger'
import type { Microlc } from '../micro-lc'

import type { BaseExtension } from './extensions'
import type { QiankunMicroApp } from './qiankun'
import type { ComposableApplicationProperties } from './update'

let currentApplication: string | undefined
const currentApplicationBus = new BehaviorSubject<string | undefined>(undefined)
const applicationHandlers = new Map<string, QiankunMicroApp>()
const pending: Promise<null>[] = []

async function flushPendingPromises() {
  const promisesToAwait = Array(pending.length)
    .fill(0)
    .reduce<Promise<null>[]>((acc) => {
      // SAFETY: length is computed before popping
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      acc.push(pending.pop()!)
      return acc
    }, [])
  return Promise.allSettled(promisesToAwait)
}

export function rerouteErrorHandler(err: TypeError): null {
  logger.error('51' as ErrorCodes.UpdateError, err.message)
  return null
}

export const currentApplication$ = currentApplicationBus.asObservable()

export function getCurrentApplicationId(): {handlers: QiankunMicroApp | undefined; id: string} | undefined {
  return currentApplication !== undefined ? {
    handlers: applicationHandlers.get(currentApplication),
    id: currentApplication,
  } : undefined
}

function getCurrentUnmount(): (() => Promise<null>) | undefined {
  let unmount: (() => Promise<null>) | undefined
  if (currentApplication) {
    const runningApp = applicationHandlers.get(currentApplication)
    unmount = runningApp?.unmount.bind(runningApp)
  }

  return unmount
}

type MatchingRoute<T extends BaseExtension> = LoadableApp<ComposableApplicationProperties<T>> | undefined

function getNextMatchingRoute<T extends BaseExtension>(
  this: Microlc<T>, pathname: string
): MatchingRoute<T>[] {
  const {
    _config: {
      settings: {
        defaultUrl,
      },
    },
  } = this

  const basePath = this.ownerDocument.querySelector('base')?.getAttribute('href') ?? '/'

  let nextMatch: MatchingRoute<T>
  let defaultMatch: MatchingRoute<T>
  for (const [route, args] of this._loadedApps.values()) {
    if (route === undefined) {
      continue
    }
    if (pathname.match(new RegExp(route))) {
      nextMatch = args
    }
    if (defaultUrl.match(new RegExp(route)) && (pathname === basePath || `${pathname}/` === basePath)) {
      defaultMatch = args
    }
  }

  return [nextMatch, defaultMatch]
}

export async function reroute<T extends BaseExtension>(this: Microlc<T>, url?: string | URL) {
  const unmount = getCurrentUnmount()


  const { pathname } = url ? new URL(url, window.location.origin) : window.location

  // ⤵️ when no match is found on loaded routes and the pathname
  // matched the base path (i.e., no plugin was mounted on root)
  // router redirects on default route if any
  const [exactMatch, defaultMatch] = getNextMatchingRoute
    .call<Microlc<T>, [string], MatchingRoute<T>[]>(this, pathname)

  let nextMatch = exactMatch

  if (!exactMatch) {
    nextMatch = defaultMatch
  }

  // ⤵️ if we got here it means we must throw a 404 since no
  // suitable route was found at all
  if (!nextMatch) {
    nextMatch = this._loadedApps.get(`${this._instance}-404`)?.[1]
  }

  // ⤵️ 404 page was not provided
  if (!nextMatch) {
    return Promise.reject(new TypeError('no 404 page available'))
  }

  // unmount previous application
  if (unmount) {
    pending.push(unmount().catch(rerouteErrorHandler))
  }

  // 👌 there's an application to mount hence we ensure that
  // any previous update operation has ended
  await flushPendingPromises()

  // set new application
  currentApplication = nextMatch.name

  // ⛰️ mount
  let handlers = applicationHandlers.get(currentApplication)
  if (handlers === undefined) {
    handlers = this._qiankun.loadMicroApp(nextMatch)
    applicationHandlers.set(currentApplication, handlers)
  }


  pending.push(
    handlers.bootstrapPromise
      // SAFETY: we ensured handlers are available
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .then(() => handlers!.mount().then(() => {
        currentApplication && currentApplicationBus.next(currentApplication)
        return null
      }))
  )
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
}

export function removeRouter() {
  popstate && window.removeEventListener('popstate', popstate)
  domcontent && window.removeEventListener('DOMContentLoaded', domcontent)
}
