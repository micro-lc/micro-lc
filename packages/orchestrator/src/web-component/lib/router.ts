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

export function getCurrentApplicationAssets(): {handlers: QiankunMicroApp | undefined; id: string} | undefined {
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

type MatchingRoute<T extends BaseExtension> = LoadableApp<ComposableApplicationProperties<T>>

type MatchingRouteReturnType<T extends BaseExtension> =
  [MatchingRoute<T> | undefined, MatchingRoute<T> | undefined, MatchingRoute<T> | undefined]

export class MatchCache<T extends BaseExtension> extends Map<string, MatchingRouteReturnType<T>> {
  _default: MatchingRouteReturnType<T> | undefined
  setDefault(match: MatchingRoute<T> | undefined) {
    this._default = [undefined, undefined, match]
  }
  getDefault(): MatchingRouteReturnType<T> | undefined {
    return this._default
  }
  invalidateCache() {
    this._default = undefined
    this.clear()
  }
}

function getNextMatchingRoute<T extends BaseExtension>(
  this: Microlc<T>, url?: string | undefined
): MatchingRouteReturnType<T> {
  const {
    _config: {
      settings: {
        defaultUrl,
      },
    },
    ownerDocument: {
      baseURI,
    },
  } = this

  const result = Array(3).fill(undefined) as MatchingRouteReturnType<T>
  const counters = Array(3).fill(0) as [number, number, number]

  const { pathname } = url ? new URL(url, baseURI) : window.location

  for (const [route, args] of this._loadedApps.values()) {
    if (route === undefined) {
      continue
    }

    const { pathname: routePathname } = new URL(route, baseURI)

    const exact = pathname.match(new RegExp(`^${routePathname}`))
    if (exact && routePathname.length > counters[0]) {
      counters[0] = routePathname.length
      result[0] = args
    }

    const { pathname: routeWtsPathname } = new URL(route.replace(/\/$/, ''), baseURI)

    const wts = pathname.match(new RegExp(`^${routeWtsPathname}`))
    if (wts && routeWtsPathname.length > counters[1]) {
      counters[1] = routeWtsPathname.length
      result[1] = args
    }

    const { pathname: defaultPathname } = new URL(defaultUrl, baseURI)
    const def = defaultPathname.match(new RegExp(`^${routePathname}`))
    if (def && routePathname.length > counters[2]) {
      counters[2] = routePathname.length
      result[2] = args
    }
  }

  url !== undefined ? this._matchCache.set(url, result) : this._matchCache.setDefault(result[2])

  console.log(this._matchCache)
  return result
}

async function flushAndGo<T extends BaseExtension>(
  this: Microlc<T>,
  nextMatch: MatchingRoute<T>,
  unmount?: (() => Promise<null>) | undefined
) {
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
    handlers = this._qiankun.loadMicroApp(nextMatch, {
      postProcessTemplate: (tplResult) => {
        if (nextMatch.props?.injectBase) {
          const head = tplResult.template.match(/<head>(.+)<\/head>/)
          if (head?.index) {
            const { index } = head
            const base = tplResult.template.match(/<base(.+)\/?>/)
            if (base === null) {
              const { pathname: route } = new URL(this._loadedRoutes.get(nextMatch.name) ?? '', this.ownerDocument.baseURI)
              const newBase = `<base href="${route}" target="_blank" />`
              tplResult.template = `
              ${tplResult.template.slice(0, index)}
                <head>
                  ${newBase}
              ${tplResult.template.slice(index + '<head>'.length)}
            `
            }
          }
        }
        console.log(tplResult.template, tplResult.scripts, tplResult.styles)
        return tplResult
      },
    })
    applicationHandlers.set(currentApplication, handlers)
  }


  pending.push(
    handlers.bootstrapPromise
      // SAFETY: we ensured handlers are available
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .then(() => handlers!.mount().then(() => {
        currentApplication && currentApplicationBus.next(
          this._applicationMapping.get(currentApplication)
        )
        return null
      }))
      .catch((err) => { console.error(err); return null })
  )
}

export async function rerouteToError<T extends BaseExtension>(this: Microlc<T>, statusCode?: number): Promise<void> {
  const unmount = getCurrentUnmount()

  const nextMatch = this._loadedApps.get(`${this._instance}-${statusCode ?? '404'}`)?.[1]

  // ⤵️ 404 page was not provided
  if (!nextMatch) {
    return Promise.reject(new TypeError('no 404 page available'))
  }

  return flushAndGo
    .call<Microlc<T>, [MatchingRoute<T>, (() => Promise<null>) | undefined], Promise<void>>(
      this, nextMatch, unmount
    )
}

export async function reroute<T extends BaseExtension>(this: Microlc<T>, url?: string | undefined): Promise<void> {
  const app = getCurrentApplicationAssets()
  const unmount = getCurrentUnmount()

  // const { pathname } = url ? new URL(url, this.ownerDocument.baseURI) : window.location
  let matchingResults = Array(3).fill(undefined) as MatchingRouteReturnType<T>
  const isDefaultCached = this._matchCache.getDefault()
  const cachedMatch = url !== undefined ? this._matchCache.get(url) : undefined
  if (url === undefined && isDefaultCached) {
    matchingResults = isDefaultCached
  } else if (cachedMatch) {
    matchingResults = cachedMatch
  } else {
  // ⤵️ when no match is found on loaded routes and the pathname
  // matched the base path (i.e., no plugin was mounted on root)
  // router redirects on default route if any
  // const [exactMatch, nextMatchWithTrailingSlash, defaultMatch]
    matchingResults = getNextMatchingRoute
      .call<Microlc<T>, [string | undefined], MatchingRouteReturnType<T>>(this, url)
  }

  const [exactMatch, nextMatchWithTrailingSlash, defaultMatch] = matchingResults

  let nextMatch = exactMatch

  if (!exactMatch && nextMatchWithTrailingSlash) {
    // 🎢 SOMETHING WEIRD ==> we are pusthing from ./route ==> ./route/ and this does not
    // create a popstate event!!!
    // 🔽 we change the url without creating an event
    const route = this._loadedRoutes.get(nextMatchWithTrailingSlash.name) as string
    window.history.replaceState(window.history.state, '', route)
    // 🧑‍🦰 and we reroute manually
    return reroute.call<Microlc<T>, [string], Promise<void>>(this, route)
  }

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

  return (nextMatch.name !== app?.id)
    ? flushAndGo.call<Microlc<T>, [MatchingRoute<T>, (() => Promise<null>) | undefined], Promise<void>>(this, nextMatch, unmount)
    : Promise.resolve()
}

function popStateListener<T extends BaseExtension>(this: Microlc<T>, event: PopStateEvent): void {
  const target = (event.target ?? window) as Window
  this._reroute(target.location.href).catch(rerouteErrorHandler)
}

function domContentLoaded(this: Window, event: Event) {
  console.error('[micro-lc] unhandled DOMContentLoaded event', event)
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
