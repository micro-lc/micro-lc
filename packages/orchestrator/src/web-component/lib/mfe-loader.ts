/* eslint-disable @typescript-eslint/no-use-before-define */
import type { ComposerApi, ComposerOptions } from '@micro-lc/composer'
import { createComposerContext, premount } from '@micro-lc/composer'
import type { Application, ComposableApplication, Content, IFrameApplication, ParcelApplication, PluginConfiguration } from '@micro-lc/interfaces/schemas/v2'
import type { Entry, LoadableApp } from 'qiankun'

import type { CompleteConfig } from '../../config'
import { toArray } from '../../utils/array.js'
import type { SchemaOptions } from '../../utils/json'

import type { MicrolcApi, MicrolcEvent } from './api'
import type { BaseExtension } from './extensions'
import { getPublicPath } from './handler.js'
import type { LoaderApi, LoaderConfiguration, LoaderLifeCycles, RoutelessMicroApp } from './qiankun'
import { createQiankunInstance } from './qiankun.js'
import type { ComposableApplicationProperties } from './update'

type RoutelessApplication =
  | Omit<IFrameApplication, 'route'>
  | Omit<ComposableApplication, 'route'>
  | Omit<ParcelApplication, 'route'>

type LoadableAppContext<T extends BaseExtension = BaseExtension, E extends MicrolcEvent = MicrolcEvent> = LoadableApp<ComposableApplicationProperties<T, E>>

const buildComposer = (mode: Application['integrationMode'], extraProperties: Record<string, unknown>): Partial<ComposerApi> => {
  const defaultComposerApi: ComposerApi = {
    context: extraProperties,
    createComposerContext,
    premount,
  }
  switch (mode) {
  case 'iframe':
    return {
      ...defaultComposerApi,
      createComposerContext: (content: Content, opts: ComposerOptions | undefined) => createComposerContext(content, {
        context: {
          ...opts?.context,
          onload() {
          /** noop */
          },
        },
        extraProperties: new Set([...(opts?.extraProperties ?? []), 'onload']),
      }),
      premount,
    }
  case 'compose':
    return { context: defaultComposerApi.context }
  case 'parcel':
  default:
    return defaultComposerApi
  }
}

const getExtraIFrameAttributes = (app: {attributes?: Record<string, string>; src?: string; srcdoc?: string}) => {
  const extraIframeAttributes: Record<string, string> = {}
  if (typeof app.attributes?.src === 'string') {
    extraIframeAttributes.src = app.attributes.src
  }
  if (typeof app.src === 'string') {
    extraIframeAttributes.src = app.src
  }
  if (typeof app.attributes?.srcdoc === 'string') {
    extraIframeAttributes.srcdoc = app.attributes.srcdoc
  }
  if (typeof app.srcdoc === 'string') {
    extraIframeAttributes.srcdoc = app.srcdoc
  }
  return extraIframeAttributes
}

const getParcelEntry = ({ entry }: ParcelApplication): Entry => {
  if (typeof entry === 'string') {
    return entry
  }

  const scripts = toArray(entry.scripts ?? [])
  const styles = toArray(entry.styles ?? [])
  if (typeof entry.html === 'string' && scripts.length === 0) {
    return entry.html
  }

  return {
    ...entry,
    scripts,
    styles,
  }
}

async function getApplicationSchema(): Promise<SchemaOptions | undefined> {
  let schema: SchemaOptions | undefined
  if (process.env.NODE_ENV === 'development') {
    schema = await import('../../utils/schemas.js').then<SchemaOptions>((schemas) => ({
      id: schemas.pluginSchema.$id,
      parts: schemas,
    }))
  }

  return schema
}

const prepareApplicationConfig = <T extends BaseExtension, E extends MicrolcEvent>(
  id: string, app: Application | RoutelessApplication, composerUri: string
) => {
  const name = `${id}-${window.crypto.randomUUID()}`
  const contextMaker = prepareRoutelessApp(name, app, composerUri)

  return {
    makeConfig: (
      container: HTMLElement | ShadowRoot,
      microlcApi: MicrolcApi<T, E>,
      sharedProperties: Record<string, unknown>
    ): LoadableAppContext<T, E> => {
      const context = contextMaker(container, { ...sharedProperties, microlcApi })

      const fetchConfigOnMount = app.integrationMode !== 'compose'
        ? undefined
        : app.options?.fetchConfigOnMount

      return {
        ...context,
        props: {
          ...context.props,
          options: { fetchConfigOnMount },
          schema: getApplicationSchema(),
        },
      }
    },
    name,
  }
}

const prepareRoutelessApp = (
  name: string, app: Application | RoutelessApplication, composerUri?: string
) => {
  let injectBase: boolean | 'override' | undefined = false
  let entry: Entry
  let config: string | PluginConfiguration | undefined
  let properties: Record<string, unknown> | undefined
  switch (app.integrationMode) {
  case 'compose':
    if (!composerUri) {
      throw new TypeError('Missing composer uri')
    }
    entry = {
      html: `
          <!DOCTYPE html>
          <html>
          <head></head>
          <body><div class="${MFELoader.COMPOSER_BODY_CLASS}" id="${name}"></div></body>
          </html>
        `,
      scripts: [composerUri],
      styles: [],
    }
    config = typeof app.config === 'string'
      ? app.config
      : { ...app.config }
    break
  case 'iframe':
    if (!composerUri) {
      throw new TypeError('Missing composer uri')
    }
    entry = { scripts: [composerUri] }
    config = {
      content: {
        attributes: {
          style: `width: inherit;
                    height: inherit;
                    border: none;`,
          ...app.attributes,
          ...getExtraIFrameAttributes(app),
        },
        content: {
          content: 'Your browser does not support iframes',
          tag: 'p',
        },
        tag: 'iframe',
      },
    }
    break
  case 'parcel':
  default:
    injectBase = app.injectBase
    entry = getParcelEntry(app)
    properties = app.properties
    break
  }

  return <P extends Record<string, unknown>>(
    container: HTMLElement | ShadowRoot,
    sharedProperties: P
  ) => ({
    // qiankun typing is
    // not precise here since a shadow root does
    // work as container of a mfe
    container: container as HTMLElement,
    entry,
    name,
    props: {
      composerApi: buildComposer(app.integrationMode, sharedProperties),
      config,
      injectBase,
      ...sharedProperties,
      ...properties,
    },
  })
}

class MFELoader<T extends BaseExtension = BaseExtension, E extends MicrolcEvent = MicrolcEvent> {
  static ID = 'microfrontend'
  static COMPOSER_BODY_CLASS = 'composer-body'

  private getApi: () => MicrolcApi<T, E>
  private loader: LoaderApi
  private composerUri: string
  private sharedProperties: Record<string, unknown>
  private handlers: RoutelessMicroApp | undefined

  private getMount(shouldMountByLoading = false): (() => Promise<null>) | undefined {
    const app = this.handlers
    if (app) {
      return () => app.loadPromise
        .then(() => app.bootstrapPromise)
        .then(() => (app.getStatus() === 'NOT_MOUNTED' && !shouldMountByLoading ? app.mount() : app.mountPromise))
    }
  }

  private getUnmount(): (() => Promise<null>) | undefined {
    const app = this.handlers
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

  private getUpdate(): ((props: Record<string, unknown>) => Promise<null>) | undefined {
    let update: ((props: Record<string, unknown>) => Promise<null>) | undefined
    const app = this.handlers
    if (app) {
      update = (props: Record<string, unknown>) => app.loadPromise
        .then(() => app.bootstrapPromise)
        .then(() => app.mountPromise)
        .then(() => app.update?.(props))
    }

    return update
  }

  constructor(
    config: CompleteConfig,
    getApi: () => MicrolcApi<T, E>,
    loader: LoaderApi
  ) {
    this.loader = loader
    this.composerUri = config.settings.composerUri
    this.sharedProperties = config.shared.properties
    this.getApi = getApi
  }

  async load(app: RoutelessApplication, container: HTMLElement | ShadowRoot) {
    const shouldMountByLoading = this.handlers === undefined

    if (shouldMountByLoading) {
      const { makeConfig } = prepareApplicationConfig<T, E>(MFELoader.ID, app, this.composerUri)
      const loadableApp = makeConfig(container, this.getApi(), this.sharedProperties)
      this.handlers = this.loader.loadMicroApp(loadableApp, { getPublicPath, sandbox: { speedy: false } })
    }

    await this.getMount(shouldMountByLoading)?.()

    return this.getUpdate()
  }

  async unload() {
    return this.getUnmount()?.()
  }
}

/**
 * Loader meant for external usage.
 *
 * By hiding `qiankun` complexity behind a wrapper allows to mount
 * a microfrontend application within a given DOM context
 * @param name {string} the name of the application
 * @param app {RoutelessApplication} context and integration mode of the application
 * @param container {HTMLElement | ShadowRoot} DOM container
 * @param lifeCycles {LoaderLifeCycles} before/after mount/unmount hooks
 * @param configuration {LoaderConfiguration} setup for sandboxing and encapsulation
 * @param loader {LoaderApi} override loader
 * @returns {RoutelessMicroApp} the context and handlers for a microfrontend application ready for mount
 */
const loadApp = (
  name: string,
  app: RoutelessApplication & {properties?: Record<string, unknown>},
  container: HTMLElement | ShadowRoot,
  lifeCycles: LoaderLifeCycles,
  {
    composerUri,
    ...configuration
  }: LoaderConfiguration,
  loader: LoaderApi = createQiankunInstance()
): RoutelessMicroApp => {
  const makeConfig = prepareRoutelessApp(name, app, composerUri)
  const loadableApp = makeConfig(container, app.properties ?? {})
  return loader.loadMicroApp(loadableApp, configuration, lifeCycles)
}

export type { LoadableAppContext, RoutelessApplication }
export { MFELoader, loadApp, prepareApplicationConfig }
