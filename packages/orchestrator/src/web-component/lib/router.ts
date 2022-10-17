import type { LoadableApp } from 'qiankun'
import { BehaviorSubject } from 'rxjs'

import type { CompleteConfig } from '../../config'
import type { ErrorCodes } from '../../logger'
import logger from '../../logger'

import type { RoutingError } from './handler'
import { getPublicPath, errorMap, RoutingErrorMessage, postProcessTemplate, microlcFetch } from './handler'
import type { LoadedAppUpdate, QiankunApi, QiankunMicroApp } from './qiankun'
import type { ComposableApplicationProperties } from './update'

type MatchingRoute = LoadableApp<ComposableApplicationProperties>

type MatchingRouteReturnType = [
  MatchingRoute | undefined, MatchingRoute | undefined, MatchingRoute | undefined
]

type LoadedAppsMap = Map<
  string,
  [string | undefined, LoadableApp<ComposableApplicationProperties>]
>

export interface RouterContainer {
  applicationMapping: Map<string, string>
  config: CompleteConfig
  readonly instance: string
  loadedApps: LoadedAppsMap
  loadedRoutes: Map<string, string>
  matchCache: MatchCache
  ownerDocument: Document
  readonly qiankun: QiankunApi
}

// module global state
let currentApplication: string | undefined
let currentApplicationBus = new BehaviorSubject<string | undefined>(undefined)
let applicationHandlers = new Map<string, QiankunMicroApp>()

export const currentApplication$ = currentApplicationBus.asObservable()

function getMount(name = currentApplication): (() => Promise<null>) | undefined {
  const app = name && applicationHandlers.get(name)
  if (app) {
    if (app.getStatus() !== 'MOUNTING') {
      return () => app.loadPromise
        .then(() => app.bootstrapPromise)
        .then(() => app.mount())
    }
    return () => app.mountPromise
  }
}

function getUnmount(name = currentApplication): (() => Promise<null>) | undefined {
  const app = name && applicationHandlers.get(name)
  if (app) {
    if (app.getStatus() !== 'UNMOUNTING') {
      return () => app.loadPromise
        .then(() => app.bootstrapPromise)
        .then(() => app.mountPromise)
        .then(() => app.unmount())
    }

    return () => app.unmountPromise
  }
}

function getUpdate(name = currentApplication): ((props: Record<string, unknown>) => Promise<null>) | undefined {
  let update: ((props: Record<string, unknown>) => Promise<null>) | undefined
  if (name) {
    const app = applicationHandlers.get(name)
    if (app) {
      update = (props: Record<string, unknown>) => app.loadPromise
        .then(() => app.bootstrapPromise)
        .then(() => app.mountPromise)
        .then(() => app.update?.(props))
    }
  }

  return update
}

export function getCurrentApplicationAssets(): {handlers: QiankunMicroApp | undefined; id: string} | undefined {
  if (currentApplication === undefined) {
    return
  }

  const handlers = applicationHandlers.get(currentApplication)

  if (handlers === undefined) {
    return
  }

  return {
    handlers: applicationHandlers.get(currentApplication),
    id: currentApplication,
  }
}

// caching utils
export class MatchCache extends Map<string, MatchingRouteReturnType> {
  _default: MatchingRouteReturnType | undefined
  setDefault(match: MatchingRoute | undefined) {
    this._default = [undefined, undefined, match]
  }
  getDefault(): MatchingRouteReturnType | undefined {
    return this._default
  }
  invalidateCache() {
    this._default = undefined
    this.clear()
  }
}

// 🚦 ROUTING
export function rerouteErrorHandler(err: TypeError): null {
  logger.error('51' as ErrorCodes.UpdateError, err.message)
  return null
}

function getIFramePathname(win = window, baseURI: string): URL {
  let completeHref = window.location.href
  const { location: { origin, href } } = win
  const iframePathname = href.match(new RegExp(origin))
  if (iframePathname?.index !== undefined) {
    completeHref = href.slice(iframePathname.index + origin.length)
  }

  return new URL(completeHref, baseURI)
}

function getNextMatchingRoute(
  this: RouterContainer, url?: string | undefined
): MatchingRouteReturnType {
  const {
    config: {
      settings: {
        defaultUrl,
      },
    },
    ownerDocument: {
      baseURI,
    },
  } = this

  const result = Array(3).fill(undefined) as MatchingRouteReturnType
  const counters = Array(3).fill(0) as [number, number, number]

  const { pathname } = url ? new URL(url, baseURI) : getIFramePathname(window, baseURI)

  for (const [route, args] of this.loadedApps.values()) {
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

  url !== undefined
    ? this.matchCache.set(url, result)
    : this.matchCache.setDefault(result[2])

  return result
}

async function flushAndGo(this: RouterContainer, nextMatch: MatchingRoute, incomingError?: RoutingError | undefined): Promise<LoadedAppUpdate> {
  let error: RoutingError | undefined = incomingError

  const unmount = getUnmount()
  currentApplication = nextMatch.name

  await unmount?.().catch(rerouteErrorHandler)

  // ⛰️ ATTEMPTING LOADING
  let handlers = applicationHandlers.get(nextMatch.name)
  if (handlers === undefined) {
    handlers = this.qiankun.loadMicroApp(nextMatch as LoadableApp<Record<string, unknown>>, {
      fetch: (input, init) => microlcFetch(input, init, error).then(([res, outgoingError]) => {
        error = outgoingError
        return res
      }),
      getPublicPath,
      postProcessTemplate: (tplResult) =>
        postProcessTemplate(tplResult, {
          baseURI: this.ownerDocument.baseURI,
          injectBase: nextMatch.props?.injectBase,
          name: nextMatch.name,
          routes: this.loadedRoutes,
        }),
    })

    applicationHandlers.set(nextMatch.name, handlers)
  }

  if (error === undefined) {
    currentApplication && currentApplicationBus.next(
      this.applicationMapping.get(currentApplication)
    )
  } else if (error.message === RoutingErrorMessage.NOT_FOUND) {
    currentApplicationBus.next(undefined)
  }

  const mount = getMount()
  await mount?.()
    .catch(async (err) => {
      const message = error?.message ?? RoutingErrorMessage.INTERNAL_SERVER_ERROR
      const status = error?.status ?? 500
      const reason = err instanceof TypeError ? err.message : undefined
      const errorRoute = this.loadedApps.get(`${this.instance}-${status}`)?.[1]

      error = { ...error, message, status }

      if (errorRoute) {
        await flushAndGo.call(this, errorRoute, error).then((update) => update?.({ message, reason }))
      }

      return undefined
    })

  return getUpdate()
}

export async function rerouteToError(this: RouterContainer, statusCode?: number, reason?: string): Promise<LoadedAppUpdate> {
  const code = statusCode ?? 404
  const nextMatch = this.loadedApps.get(`${this.instance}-${code}`)?.[1]

  // ⤵️ 404 page was not provided
  if (!nextMatch) {
    return Promise.reject(new TypeError(`no ${code} page available`))
  }

  return flushAndGo.call(this, nextMatch, { message: errorMap[code], reason, status: code })
    .then(async (update) => {
      await update?.({ message: 'Oops! Something went wrong', reason })
      return undefined
    })
}

function isDefault(url: string, baseURI: string): boolean {
  const { pathname } = new URL(url, window.document.baseURI)
  return pathname.replace(/\/$/, '') === new URL(baseURI, window.document.baseURI).pathname.replace(/\/$/, '')
}

export async function reroute(this: RouterContainer, url?: string | undefined): Promise<LoadedAppUpdate | void> {
  // get matching result via cache when available
  let matchingResults = Array(3).fill(undefined) as MatchingRouteReturnType
  const isDefaultCached = this.matchCache.getDefault()
  const cachedMatch = url !== undefined ? this.matchCache.get(url) : undefined

  if (url === undefined && isDefaultCached) {
    matchingResults = isDefaultCached
  } else if (cachedMatch) {
    matchingResults = cachedMatch
  } else {
    // ⤵️ when no match is found on loaded routes and the pathname
    // matched the base path (i.e., no plugin was mounted on root)
    // router redirects on default route if any
    // const [exactMatch, nextMatchWithTrailingSlash, defaultMatch]
    matchingResults = getNextMatchingRoute.call(this, url)
  }

  const [exactMatch, nextMatchWithTrailingSlash, defaultMatch] = matchingResults

  let nextMatch = exactMatch
  let error: RoutingError | undefined

  if (!exactMatch && nextMatchWithTrailingSlash) {
    // 🎢 SOMETHING WEIRD ==> we are pusthing from ./route ==> ./route/ and this does not
    // create a popstate event!!!
    // 🔽 we change the url without creating an event
    const route = this.loadedRoutes.get(nextMatchWithTrailingSlash.name) as string
    window.history.replaceState(window.history.state, '', route)
    // 🧑‍🦰 and we reroute manually
    return reroute.call(this, route)
  }

  if (!exactMatch && isDefault(url ?? window.location.href, this.ownerDocument.baseURI)) {
    window.history.replaceState(window.history.state, '', this.config.settings.defaultUrl)
    nextMatch = defaultMatch
  }

  // ⤵️ if we got here it means we must throw a 404 since no
  // suitable route was found at all
  if (!nextMatch) {
    error = { message: RoutingErrorMessage.NOT_FOUND, reason: `Page ${url ?? window.location.pathname} cannot be found`, status: 404 }
    nextMatch = this.loadedApps.get(`${this.instance}-404`)?.[1]
  }

  // ⤵️ 404 page was not provided
  if (!nextMatch) {
    error = { message: RoutingErrorMessage.NOT_FOUND, reason: 'No 404 page available', status: 404 }
    return Promise.reject(new TypeError('no 404 page available'))
  }

  return (nextMatch.name !== currentApplication)
    ? flushAndGo.call(this, nextMatch, error).then(async (update) => { await update?.({ ...error }) })
    : Promise.resolve()
}

// 🔄 ROUTER
let popstate: ((ev: PopStateEvent) => unknown) | undefined
let domcontent: ((ev: Event) => unknown) | undefined

function popStateListener(this: RouterContainer, event: PopStateEvent): void {
  const target = (event.target ?? window) as Window
  reroute.call(this, target.location.href).catch(rerouteErrorHandler)
}

function domContentLoaded(this: Window, event: Event) {
  console.warn('[micro-lc] unhandled DOMContentLoaded event', event)
}

export function createRouter(this: RouterContainer) {
  popstate = popStateListener.bind(this)
  domcontent = domContentLoaded.bind(window)
  window.addEventListener('popstate', popstate)
  window.addEventListener('DOMContentLoaded', domContentLoaded)
}

export function removeRouter() {
  currentApplication = undefined
  currentApplicationBus = new BehaviorSubject<string | undefined>(undefined)
  applicationHandlers = new Map<string, QiankunMicroApp>()

  popstate && window.removeEventListener('popstate', popstate)
  domcontent && window.removeEventListener('DOMContentLoaded', domcontent)
}
