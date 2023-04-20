/**
  Copyright 2022 Mia srl

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
import type { LoadableApp } from 'qiankun'
import { BehaviorSubject } from 'rxjs'

import type { CompleteConfig } from '../../config'
import type { ErrorCodes } from '../../logger'
import logger from '../../logger'

import type { RoutingError } from './handler'
import { getPublicPath, errorMap, RoutingErrorMessage, postProcessTemplate, microlcFetch } from './handler'
import type { LoadedAppUpdate, QiankunApi, QiankunMicroApp } from './qiankun'
import type { ComposableApplicationProperties } from './update'
import { effectiveRouteLength, urlMatch } from './url-matcher'

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

export function getUnmount(name = currentApplication): (() => Promise<null>) | undefined {
  const app = name && applicationHandlers.get(name)
  if (app) {
    if (app.getStatus() !== 'UNMOUNTING') {
      return () => app.loadPromise
        .then(() => app.bootstrapPromise)
        .then(() => app.mountPromise)
        .then(() => (app.getStatus() === 'NOT_MOUNTED' ? app.unmountPromise : app.unmount()))
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

const updateCountersAndResults = (
  pathname: string,
  route: string,
  defaultUrl: string,
  baseURI: string,
  args: LoadableApp<ComposableApplicationProperties>,
  counters: number[],
  result: MatchingRouteReturnType
) => {
  const { pathname: routePathname } = new URL(route, baseURI)

  const exact = urlMatch(pathname, routePathname)
  const routePathnameLength = effectiveRouteLength(routePathname)
  if (exact && routePathnameLength > counters[0]) {
    counters[0] = routePathnameLength
    result[0] = args
  }

  const { pathname: routeWtsPathname } = new URL(route.replace(/\/$/, ''), baseURI)

  const wts = urlMatch(pathname, routeWtsPathname)
  const routeWtsPathnameLength = effectiveRouteLength(routeWtsPathname)
  if (wts && routeWtsPathnameLength > counters[1]) {
    counters[1] = routeWtsPathnameLength
    result[1] = args
  }

  const { pathname: defaultPathname } = new URL(defaultUrl, baseURI)
  // const def = defaultPathname.match(new RegExp(`^${routePathname}`))
  const def = urlMatch(defaultPathname, routePathname)
  // const routeWtsPathnameLength = effectiveRouteLength(routeWtsPathname)
  if (def && routePathnameLength > counters[2]) {
    counters[2] = routePathnameLength
    result[2] = args
  }
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

    updateCountersAndResults(
      pathname, route, defaultUrl, baseURI, args, counters, result
    )
  }

  url !== undefined
    ? this.matchCache.set(url, result)
    : this.matchCache.setDefault(result[2])

  return result
}

function isSameError(first: RoutingError, second: RoutingError): boolean {
  if (first.message !== second.message) {
    return false
  }

  if (first.reason !== second.reason) {
    return false
  }

  if (first.status !== second.status) {
    return false
  }

  return true
}

async function flushAndGo(
  this: RouterContainer,
  nextMatch: MatchingRoute,
  url?: string,
  incomingError?: RoutingError | undefined,
  previousIncomingError?: RoutingError | undefined
): Promise<LoadedAppUpdate> {
  if (previousIncomingError && incomingError && isSameError(previousIncomingError, incomingError)) {
    return undefined
  }

  let error: RoutingError | undefined = incomingError

  const unmount = getUnmount()
  currentApplication = nextMatch.name

  await unmount?.().catch(rerouteErrorHandler)

  // ⛰️ ATTEMPTING LOADING
  let handlers = applicationHandlers.get(nextMatch.name)
  if (handlers === undefined) {
    const appConfigName = this.applicationMapping.get(currentApplication)
    const [route] = (appConfigName !== undefined ? this.loadedApps.get(appConfigName) : appConfigName) ?? []
    const application = nextMatch as LoadableApp<Record<string, unknown>>
    handlers = this.qiankun.loadMicroApp(application, {
      fetch: (input, init) => microlcFetch(input, init, error).then(([res, outgoingError]) => {
        error = outgoingError
        return res
      }),
      getPublicPath,
      postProcessTemplate: (tplResult) => {
        console.log(url, window.location.href, this.ownerDocument.baseURI)
        return postProcessTemplate(tplResult, {
          baseURI: this.ownerDocument.baseURI,
          injectBase: nextMatch.props?.injectBase,
          name: nextMatch.name,
          url: route ?? url ?? window.location.href,
        })
      },
      // TODO: remove when https://github.com/umijs/qiankun/pull/2450 is merged
      sandbox: { speedy: false },
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
        await flushAndGo.call(this, errorRoute, url, error, incomingError).then((update) => update?.({ message, reason }))
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

  return flushAndGo.call(this, nextMatch, undefined, { message: errorMap[code], reason, status: code })
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
    ? flushAndGo.call(this, nextMatch, url, error).then(async (update) => { await update?.({ ...error }) })
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
