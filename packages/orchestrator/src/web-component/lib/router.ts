/* eslint-disable max-statements */
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

import type { MicrolcApi, MicrolcEvent } from './api'
import type { BaseExtension } from './extensions'
import type { RoutingError } from './handler'
import { getPublicPath, errorMap, RoutingErrorMessage, postProcessTemplate, microlcFetch } from './handler'
import type { LoadableAppContext } from './mfe-loader'
import type { LoadedAppUpdate, QiankunApi, QiankunMicroApp } from './qiankun'
import { effectiveRouteLength, urlMatch } from './url-matcher'

type MatchingRoute<T extends BaseExtension, E extends MicrolcEvent> = LoadableAppContext<T, E>

type MatchingRouteReturnType<T extends BaseExtension, E extends MicrolcEvent> = [
  MatchingRoute<T, E> | undefined, MatchingRoute<T, E> | undefined, MatchingRoute<T, E> | undefined
]

type LoadedAppsMap<T extends BaseExtension, E extends MicrolcEvent> = Map<
  string,
  [string | undefined, LoadableAppContext<T, E>]
>

interface PushArgs {
  data?: unknown
  method?: 'push' | 'replace'
  url?: string | undefined
}

export interface RouterContainer<T extends BaseExtension = BaseExtension, E extends MicrolcEvent = MicrolcEvent> {
  applicationMapping: Map<string, string>
  config: CompleteConfig
  getApi: () => MicrolcApi<T, E>
  readonly instance: string
  loadedApps: LoadedAppsMap<T, E>
  loadedRoutes: Map<string, string>
  matchCache: MatchCache<T, E>
  ownerDocument: Document
  readonly qiankun: QiankunApi
}

// module global state
let currentApplication: string | undefined
let currentApplicationBus = new BehaviorSubject<string | undefined>(undefined)
let applicationHandlers = new Map<string, QiankunMicroApp>()

const currentApplication$ = currentApplicationBus.asObservable()


function getMount(name: string, shouldMountByLoading = false): (() => Promise<null>) | undefined {
  const app = name && applicationHandlers.get(name)
  if (app) {
    return () => app.loadPromise
      .then(() => app.bootstrapPromise)
      .then(() => (app.getStatus() === 'NOT_MOUNTED' && !shouldMountByLoading ? app.mount() : app.mountPromise))
  }
}

function getUnmount(name = currentApplication): (() => Promise<null>) | undefined {
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

function getCurrentApplicationAssets(): {handlers: QiankunMicroApp | undefined; id: string} | undefined {
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
class MatchCache<T extends BaseExtension, E extends MicrolcEvent> extends Map<string, MatchingRouteReturnType<T, E>> {
  _default: MatchingRouteReturnType<T, E> | undefined
  setDefault(match: MatchingRoute<T, E> | undefined) {
    this._default = [undefined, undefined, match]
  }
  getDefault(): MatchingRouteReturnType<T, E> | undefined {
    return this._default
  }
  invalidateCache() {
    this._default = undefined
    this.clear()
  }
}

// 🚦 ROUTING
function rerouteErrorHandler(err: TypeError): null {
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

const updateCountersAndResults = <T extends BaseExtension, E extends MicrolcEvent>(
  pathname: string,
  route: string,
  defaultUrl: string,
  baseURI: string,
  args: LoadableAppContext<T, E>,
  counters: number[],
  result: MatchingRouteReturnType<T, E>
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

function getNextMatchingRoute<T extends BaseExtension, E extends MicrolcEvent>(
  this: RouterContainer<T, E>, url?: string | undefined
): {counters: [number, number, number]; result: MatchingRouteReturnType<T, E>} {
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

  const result = Array(3).fill(undefined) as MatchingRouteReturnType<T, E>
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

  return {
    counters,
    result,
  }
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

async function flushAndGo<T extends BaseExtension, E extends MicrolcEvent>(
  this: RouterContainer<T, E>,
  nextMatch: MatchingRoute<T, E>,
  args: PushArgs = {},
  incomingError?: RoutingError | undefined,
  previousIncomingError?: RoutingError | undefined
): Promise<LoadedAppUpdate> {
  const recursiveFlushAndGo = flushAndGo
    .bind<(nextMatch: MatchingRoute<T, E>, args: PushArgs, incomingError?: RoutingError | undefined, previousIncomingError?: RoutingError | undefined) => ReturnType<typeof flushAndGo>>(this)
  if (previousIncomingError && incomingError && isSameError(previousIncomingError, incomingError)) {
    return undefined
  }

  let error: RoutingError | undefined = incomingError

  const unmount = getUnmount()
  currentApplication = nextMatch.name

  await unmount?.().catch(rerouteErrorHandler)

  const { url, method = 'push', data } = args ?? {}
  // in case of error this is not triggered since
  // args is an empty object and url is undefined
  // ⚾ this behavior must be kept!
  if (url !== undefined) {
    if (method === 'push') {
      window.history.pushState(data, '', url)
    } else {
      window.history.replaceState(data, '', url)
    }
  }

  // ⛰️ ATTEMPTING LOADING
  let handlers = applicationHandlers.get(nextMatch.name)

  // 🐛 when qiankun loads a micro app
  // it calls the bootstrap and mount
  // making the first call on load too fast when called
  // by `getMount` to be seen just by calling the mount state
  const shouldMountByLoading = handlers === undefined
  if (shouldMountByLoading) {
    const appConfigName = this.applicationMapping.get(currentApplication)
    const [route] = (appConfigName !== undefined ? this.loadedApps.get(appConfigName) : appConfigName) ?? []
    const application = nextMatch as LoadableApp<Record<string, unknown>>
    handlers = this.qiankun.loadMicroApp(application, {
      // @ts-expect-error wrong typing added in @types/node@20.8.5
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
          url: route ?? url ?? window.location.href,
        }),
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

  await getMount(currentApplication, shouldMountByLoading)?.()
    .catch(async (err) => {
      const message = error?.message ?? RoutingErrorMessage.INTERNAL_SERVER_ERROR
      const status = error?.status ?? 500
      const reason = err instanceof TypeError ? err.message : undefined
      const errorRoute = this.loadedApps.get(`${this.instance}-${status}`)?.[1]

      error = { ...error, message, status }

      if (errorRoute) {
        await recursiveFlushAndGo(errorRoute, args, error, incomingError).then((update) => update?.({ message, reason }))
      }

      return undefined
    })

  return getUpdate()
}

async function rerouteToError<T extends BaseExtension, E extends MicrolcEvent>(this: RouterContainer<T, E>, statusCode?: number, reason?: string): Promise<LoadedAppUpdate> {
  const code = statusCode ?? 404
  const nextMatch = this.loadedApps.get(`${this.instance}-${code}`)?.[1]

  // ⤵️ 404 page was not provided
  if (!nextMatch) {
    return Promise.reject(new TypeError(`no ${code} page available`))
  }

  const recursiveFlushAndGo = flushAndGo
    .bind<(nextMatch: MatchingRoute<T, E>, args: PushArgs, incomingError?: RoutingError | undefined, previousIncomingError?: RoutingError | undefined) => ReturnType<typeof flushAndGo>>(this)

  return recursiveFlushAndGo(nextMatch, {}, { message: errorMap[code], reason, status: code })
    .then(async (update) => {
      await update?.({ message: 'Oops! Something went wrong', reason })
      return undefined
    })
}

function isDefault(url: string, baseURI: string): boolean {
  const { pathname } = new URL(url, window.document.baseURI)
  return pathname.replace(/\/$/, '') === new URL(baseURI, window.document.baseURI).pathname.replace(/\/$/, '')
}

async function reroute<T extends BaseExtension, E extends MicrolcEvent>(
  this: RouterContainer<T, E>, args: PushArgs = {}
): Promise<LoadedAppUpdate | void> {
  let { url, data, method = 'push' } = args

  // get matching result via cache when available
  let matchingResults = Array(3).fill(undefined) as MatchingRouteReturnType<T, E>
  let counters = Array(3).fill(0) as [number, number, number]
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
    const recursiveGetNextMatchingRoute = getNextMatchingRoute
      .bind<(url?: string | undefined) => ReturnType<typeof getNextMatchingRoute<T, E>>>(this)
    const nextMatch = recursiveGetNextMatchingRoute(url)
    matchingResults = nextMatch.result
    counters = nextMatch.counters
  }

  const [exactMatch, nextMatchWithTrailingSlash, defaultMatch] = matchingResults

  let nextMatch = exactMatch
  let error: RoutingError | undefined

  if ((nextMatchWithTrailingSlash && counters[1] > counters[0]) || (!exactMatch && nextMatchWithTrailingSlash)) {
    // 🎢 SOMETHING WEIRD ==> we are pusthing from ./route ==> ./route/ and this does not
    // create a popstate event!!!
    // 🔽 we change the url without creating an event
    const route = this.loadedRoutes.get(nextMatchWithTrailingSlash.name) as string
    // 🧑‍🦰 and we reroute manually
    const recursiveReroute = reroute
      .bind<(args?: PushArgs) => ReturnType<typeof reroute>>(this)
    return recursiveReroute({ data: window.history.state, method: 'replace', url: route })
  }

  if (!exactMatch && isDefault(url ?? window.location.href, this.ownerDocument.baseURI)) {
    url = this.config.settings.defaultUrl
    data = window.history.state
    method = 'replace'
    // window.history.replaceState(window.history.state, '', this.config.settings.defaultUrl)
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

  const recursiveFlushAndGo = flushAndGo
    .bind<(
      nextMatch: MatchingRoute<T, E>,
      args: PushArgs,
      incomingError?: RoutingError | undefined,
      previousIncomingError?: RoutingError | undefined,
    ) => ReturnType<typeof flushAndGo>>(this)
  return (nextMatch.name !== currentApplication)
    ? recursiveFlushAndGo(nextMatch, { data, method, url }, error).then(async (update) => { await update?.({ ...error }) })
    : Promise.resolve()
}

// 🔄 ROUTER
let popstate: ((ev: PopStateEvent) => unknown) | undefined
let domcontent: ((ev: Event) => unknown) | undefined

function popStateListener<T extends BaseExtension, E extends MicrolcEvent>(this: RouterContainer<T, E>, event: PopStateEvent): void {
  const target = (event.target ?? window) as Window
  const recursiveReroute = reroute
    .bind<(args?: PushArgs) => ReturnType<typeof reroute>>(this)
  recursiveReroute({ url: target.location.href }).catch(rerouteErrorHandler)
}

function domContentLoaded(this: Window, event: Event) {
  console.warn('[micro-lc] unhandled DOMContentLoaded event', event)
}

function createRouter<T extends BaseExtension, E extends MicrolcEvent>(this: RouterContainer<T, E>) {
  popstate = popStateListener.bind<(event: PopStateEvent) => void>(this)
  domcontent = domContentLoaded.bind(window)
  window.addEventListener('popstate', popstate)
  window.addEventListener('DOMContentLoaded', domContentLoaded)
}

function removeRouter() {
  currentApplication = undefined
  currentApplicationBus = new BehaviorSubject<string | undefined>(undefined)
  applicationHandlers = new Map<string, QiankunMicroApp>()

  popstate && window.removeEventListener('popstate', popstate)
  domcontent && window.removeEventListener('DOMContentLoaded', domcontent)
}

export type { PushArgs }
export {
  currentApplication$,
  getUnmount,
  getCurrentApplicationAssets,
  MatchCache,
  reroute,
  rerouteToError,
  rerouteErrorHandler,
  createRouter,
  removeRouter,
}
