import { start, setDefaultMountApp, loadMicroApp } from 'qiankun'
import type { MicroApp as QiankunMicroApp, FrameworkConfiguration } from 'qiankun'

import type { ErrorCodes } from '../../logger'
import logger from '../../logger'
import type { SchemaOptions } from '../../utils/json'

export type { QiankunMicroApp }

export type LoadedAppUpdate = ((customProps: Record<string, unknown>) => Promise<null>) | undefined

export type MicroApp = QiankunMicroApp & {
  route: string
}

export interface QiankunApi {
  loadMicroApp: typeof loadMicroApp
  schema?: SchemaOptions
  setDefaultMountApp: typeof setDefaultMountApp
  start: typeof start
}

export function updateErrorHandler(app: string, err: TypeError): void {
  logger.error('50' as ErrorCodes.UpdateError, app, err.message)
}

export function createQiankunInstance(): QiankunApi {
  return {
    loadMicroApp,
    setDefaultMountApp,
    start,
  }
}

type TemplateResult = Parameters<Exclude<FrameworkConfiguration['postProcessTemplate'], undefined>>[0]

interface PostProcessTemplateOptions {
  baseURI?: string | undefined
  injectBase?: boolean
  name: string
  routes: Map<string, string>
}

export function postProcessTemplate(tplResult: TemplateResult, opts: PostProcessTemplateOptions): TemplateResult {
  if (opts.injectBase) {
    const head = tplResult.template.match(/<head>(.+)<\/head>/)
    if (head?.index) {
      const { index } = head
      const base = tplResult.template.match(/<base(.+)\/?>/)
      if (base === null) {
        const { pathname: route } = new URL(opts.routes.get(opts.name) ?? '', opts.baseURI)
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
  return tplResult
}
