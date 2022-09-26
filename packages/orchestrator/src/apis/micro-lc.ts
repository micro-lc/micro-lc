import type { Config, PluginConfiguration } from '@micro-lc/interfaces'
import { html, render as litHtmlRender } from 'lit-html'
import { camelCase, kebabCase } from 'lodash-es'
import type { LoadableApp } from 'qiankun'

import type { ResolvedConfig } from '../composer'
import { createComposerContext, premount } from '../composer'
import type { CompleteConfig } from '../config'
import { mergeConfig, defaultConfig } from '../config'
import { createImportMapTag, ImportMapRegistry } from '../dom'
import { createRouter, reroute } from '../router'
import type { SchemaOptions } from '../utils/json'
import { invalidJsonCatcher, jsonFetcher, jsonToObject, jsonToObjectCatcher } from '../utils/json'

import { createMicrolcApiInstance } from './core'
import type { MicrolcApi } from './core'
import type { BaseExtension } from './extensions'
import { initBaseExtensions } from './extensions'
import type {
  ComposableApplicationProperties } from './micro-lc.lib'
import {
  createHistoryProxy,
  handleInitImportMapError,
  initImportMapSupport,
  updateApplications,
  updateCSS,
  updateGlobalImportapMap,
} from './micro-lc.lib'
import { createQiankunInstance } from './qiankun'

type ObservedAttributes =
  | 'config-src'
  | 'disable-shadow-dom'
  | 'disable-shims'
type ObservedProperties =
  | 'config'
  | 'configSrc'
  | 'disableShadowDom'
  | 'disableShims'

const booleanAttributes: ObservedAttributes[] = ['disable-shadow-dom', 'disable-shims']

const handleUpdateError = (_: TypeError): void => {
  console.error(_)
}

const template = ({ id, slot }: Exclude<CompleteConfig['settings']['pluginMountPointSelector'], string>) =>
  (slot ? html`<div id=${id} slot=${slot}></div>` : html`<div id=${id}></div>`)

export class Microlc<E extends BaseExtension = BaseExtension> extends HTMLElement {
  static get observedAttributes() { return ['config-src', 'disable-shadow-dom', 'disable-shims'] }

  private _wasDisconnected = false
  private _updateComplete = true
  protected _updateRequests = 0
  protected _$$updatesCount: number | null = null

  protected _config: CompleteConfig = defaultConfig
  protected _configSrc: string | null | undefined
  protected _disableShadowDom = false
  protected _disableShims = false

  // queries
  protected _esmsOptionsScript!: HTMLScriptElement
  protected _styleTags: HTMLStyleElement[] = []
  protected _globalImportmap = createImportMapTag(this.ownerDocument)
  protected _layoutImportmap = createImportMapTag(this.ownerDocument)
  protected _applicationsImportMap = new ImportMapRegistry<E>(this)
  protected _loadedApps = new Map<string, [string, LoadableApp<ComposableApplicationProperties<E>>]>()
  protected _loadedRoutes = new Map<string, string>()
  protected _router = createRouter.call<Microlc<E>, [], void>(this)
  protected _reroute = reroute.bind<(url?: string | URL) => Promise<void>>(this)

  // properties/attributes update
  protected _prepareForUpdate() {
    this._updateRequests += 1
    this._updateComplete = false
  }

  protected _completeUpdate() {
    this._updateRequests = 0
    this._updateComplete = true
  }

  protected _handlePropertyUpdate<T>(
    name: ObservedProperties,
    newValue: unknown,
    checkType: (input: unknown) => input is Exclude<T, undefined> = (_: unknown): _ is Exclude<T, undefined> => true
  ): void {
    const nextValue = checkType(newValue) ? newValue : undefined

    Object.assign(this, { [`_${name}`]: nextValue })

    const candidateAttribute = kebabCase(name)
    if (Microlc.observedAttributes.includes(candidateAttribute)) {
      if (typeof nextValue === 'string') {
        this.setAttribute(kebabCase(name), nextValue)
      } else if (nextValue === true) {
        this.setAttribute(kebabCase(name), '')
      } else {
        this.removeAttribute(kebabCase(name))
      }
    }

    // Killer feature 😏
    setTimeout(() => {
      this.update()
        .then(() => {
          this._qiankun.start()
          return this._reroute()
        })
        .catch(handleUpdateError)
    })
  }

  get config(): CompleteConfig | undefined {
    return this._config
  }

  set config(src: unknown) {
    this._configSrc = null
    this.removeAttribute('config-src')

    this._prepareForUpdate()

    this._handlePropertyUpdate(
      'config',
      mergeConfig(src as Config),
    )
  }

  get configSrc(): string | null | undefined {
    return this._configSrc
  }

  set configSrc(src: unknown) {
    if (src !== this._configSrc) {
      this._prepareForUpdate()

      this._handlePropertyUpdate(
        'configSrc',
        src,
        (input): input is string => typeof input === 'string'
      )
    }
  }

  get disableShadowDom(): boolean {
    return Boolean(this._disableShadowDom)
  }

  set disableShadowDom(disable: unknown) {
    if (disable !== this._disableShadowDom) {
      this._prepareForUpdate()

      this._handlePropertyUpdate(
        'disableShadowDom',
        disable,
        (input): input is boolean => typeof input === 'boolean'
      )
    }
  }

  get disableShims(): boolean {
    return Boolean(this._disableShims)
  }

  set disableShims(shims: unknown) {
    if (shims !== this._disableShims) {
      this._prepareForUpdate()

      this._handlePropertyUpdate(
        'disableShims',
        shims,
        (input): input is boolean => typeof input === 'boolean'
      )
    }
  }

  get updateComplete(): boolean {
    return this._updateComplete
  }

  get $$updatesCount(): number | null {
    return this._$$updatesCount
  }

  // 🐝 api

  protected _$$originalHistory!: History
  protected _history = createHistoryProxy.call<Microlc<E>, [], History>(this)
  protected _qiankun = createQiankunInstance()
  protected _extensions: E = initBaseExtensions.call<Microlc<E>, [], E>(this)
  protected getApi: () => MicrolcApi<E> = createMicrolcApiInstance
    .call<Microlc<E>, [], () => MicrolcApi<E>>(this)

  // 🚲 lifecycle & DOM

  protected _isShadow() {
    return !this._disableShadowDom
  }

  private _shadowRoot: ShadowRoot

  get shadowRoot(): ShadowRoot {
    return this._shadowRoot
  }

  get renderRoot(): this | ShadowRoot {
    return this.disableShadowDom ? this : this._shadowRoot
  }

  constructor() {
    super()
    this._shadowRoot = this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    if (this._wasDisconnected) {
      this.ownerDocument.head.appendChild(this._globalImportmap)
      this.ownerDocument.head.appendChild(this._layoutImportmap)
    }
    initImportMapSupport
      .call<Microlc<E>, [], Promise<void>>(this).catch(handleInitImportMapError)

    this._wasDisconnected = false
  }

  attributeChangedCallback(
    name: ObservedAttributes, oldValue: string | null, newValue: unknown
  ) {
    const nextValue = booleanAttributes.includes(name) && newValue === ''
      ? true
      : newValue


    if (oldValue !== nextValue) {
      Object.assign(this, { [camelCase(name)]: nextValue })
    }
  }

  async update(): Promise<boolean> {
    if (this._updateRequests === 1) {
      if (process.env.NODE_ENV === 'test') {
        if (this._$$updatesCount === null) {
          this._$$updatesCount = 0
        }
        this._$$updatesCount += 1
      }

      if (typeof this._configSrc === 'string') {
        const config = await jsonFetcher(this._configSrc)
          .then((json) => {
            if (process.env.NODE_ENV === 'development') {
              return Promise.all<[unknown, SchemaOptions]>([
                Promise.resolve(json),
                import('../utils/schemas').then<SchemaOptions | undefined>((schemas) => ({
                  id: schemas.configSchema.$id,
                  parts: schemas,
                })),
              ])
            }
            return [json, undefined] as [unknown, SchemaOptions | undefined]
          })
          .then(([json, schema]) =>
            jsonToObject<Config>(json, schema)
              .catch((err: TypeError) =>
                jsonToObjectCatcher<Config>(
                  err, defaultConfig, '"micro-lc config"'
                )
              )
          )
          .catch((err: TypeError) =>
            invalidJsonCatcher<Config>(
              err, defaultConfig, '"micro-lc config"'
            )
          )

        this._config = mergeConfig(config)
      }
      // run update
      // 1 => CSS
      updateCSS.call<Microlc<E>, [], void>(this)
      // 2 => import-map
      updateGlobalImportapMap.call<Microlc<E>, [], void>(this)

      // then render to ensure that mount point is in page
      // layout is attached with its own importmap
      await this.render()

      // 3 => qiankun
      return updateApplications.call<Microlc<E>, [], Promise<void>>(this)
        .then(() => Promise.resolve(true))
        .finally(() => {
          this._completeUpdate()
        })
    }

    this._updateRequests -= 1
    return Promise.resolve(false)
  }

  async render(): Promise<void> {
    const {
      _config: {
        layout,
        settings: {
          pluginMountPointSelector,
        },
      },
    } = this

    const { content } = await premount
      .call<Microlc<E>, [HTMLScriptElement, PluginConfiguration], Promise<ResolvedConfig>>(this, this._layoutImportmap, layout)
    !this._layoutImportmap.isConnected && this.ownerDocument.head.appendChild(this._layoutImportmap)
    const layoutAppender = await createComposerContext(content, {
      context: { microlcApi: this.getApi() },
      extraProperties: ['microlcApi'],
    })

    if (this._isShadow()) {
      layoutAppender(this._shadowRoot)
      litHtmlRender(
        template(pluginMountPointSelector),
        this
      )
    } else {
      layoutAppender(this)
    }
  }

  disconnectedCallback() {
    // remove all tags related with microlc
    // but `es-module-shims`
    [...this._styleTags, this._globalImportmap, this._layoutImportmap].forEach((el) => {
      el.remove()
    })
    this._applicationsImportMap.removeAll()

    // restore history
    Object.defineProperty(window, 'history', {
      value: this._$$originalHistory,
      writable: true,
    })

    this._wasDisconnected = true
  }
}
