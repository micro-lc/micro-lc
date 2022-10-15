import type { Entry, FrameworkConfiguration } from 'qiankun'

type TemplateResult = Parameters<Exclude<FrameworkConfiguration['postProcessTemplate'], undefined>>[0]

export enum RoutingErrorMessage {
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED'
}

export const errorMap: Record<number, RoutingErrorMessage> = {
  401: RoutingErrorMessage.UNAUTHORIZED,
  404: RoutingErrorMessage.NOT_FOUND,
  500: RoutingErrorMessage.INTERNAL_SERVER_ERROR,
}

export interface RoutingError {
  message?: RoutingErrorMessage
  reason?: string
  status?: number
}

export const microlcFetch = async (input: RequestInfo | URL, init?: RequestInit, error?: RoutingError | undefined): Promise<[Response, RoutingError | undefined]> =>
  window.fetch(input, init)
    .then((res) => {
      let reason = input as string
      if (input instanceof URL) {
        reason = input.href
      } else if (input instanceof Request) {
        reason = input.url
      }

      return res.status > 299
        ? [res, { ...error, message: errorMap[res.status], reason }]
        : [res, undefined]
    })

interface PostProcessTemplateOptions {
  baseURI?: string | undefined
  injectBase?: boolean
  name: string
  routes: Map<string, string>
}

export function postProcessTemplate(tplResult: TemplateResult, opts: PostProcessTemplateOptions): TemplateResult {
  console.log(opts.injectBase, opts)
  if (opts.injectBase) {
    const parser = new DOMParser()
    const document = parser.parseFromString(tplResult.template, 'text/html')
    const head = document.querySelector('head')
    const base = document.querySelector('base')
    if (base === null) {
      const { pathname: route } = new URL(opts.routes.get(opts.name) ?? '', opts.baseURI)
      head?.appendChild(
        Object.assign(document.createElement('base'), {
          href: route,
          target: '_blank',
        })
      )
      tplResult.template = document.documentElement.outerHTML
    }
  }
  return tplResult
}

export const getPublicPath = (entry: Entry): string => {
  const path = (typeof entry === 'string' ? entry : (entry.html ?? ''))
  const { origin, pathname } = new URL(path, window.document.baseURI)
  return `${origin}${pathname}`
}
