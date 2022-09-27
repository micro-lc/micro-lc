import type { Config, PluginConfiguration } from '@micro-lc/interfaces'
import { html, render as litHtmlRender } from 'lit-html'
import { camelCase, kebabCase } from 'lodash-es'
import type { LoadableApp } from 'qiankun'

import type { ResolvedConfig } from '../composer'
import { createComposerContext, premount } from '../composer'
import type { CompleteConfig } from '../config'
import { mergeConfig, defaultConfig } from '../config'
import { createImportMapTag, ImportMapRegistry } from '../dom-manipulation'


import type { MicrolcApi, ComposableApplicationProperties, BaseExtension } from './lib'
import {
  createMicrolcApiInstance,
  createRouter,
  removeRouter,
  reroute,
  rerouteErrorHandler,
  fetchConfig,
  handleInitImportMapError,
  initImportMapSupport,
  updateApplications,
  updateGlobalImportapMap,
  initBaseExtensions } from './lib'
import { createQiankunInstance } from './lib/qiankun'

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
  protected _instance = window.crypto.randomUUID()

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
  protected _loadedApps = new Map<string, [string | undefined, LoadableApp<ComposableApplicationProperties<E>>]>()
  protected _loadedRoutes = new Map<string, string>()
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
    // reschedule update to include more subsequent
    // `setAttribute` calls
    setTimeout(() => {
      this.update()
        .then(() => this._reroute().catch(rerouteErrorHandler))
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

  /**
   * @observedProperty --> mirrored by `config-src`
   */
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

  /**
   * @observedProperty --> mirrored by `disable-shadow-dom`
   */
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

  /**
   * @observedProperty --> mirrored by `disable-shims`
   */
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

    createRouter.call<Microlc<E>, [], void>(this)

    this._wasDisconnected = false
  }

  attributeChangedCallback(
    name: ObservedAttributes, oldValue: string | null, newValue: unknown
  ) {
    let nextValue: unknown = newValue
    if (booleanAttributes.includes(name) && newValue === '') {
      nextValue = true
    } else if (newValue === '') {
      nextValue = null
    }

    if (oldValue !== nextValue) {
      Object.assign(this, { [camelCase(name)]: nextValue })
    }
  }

  async update(): Promise<boolean> {
    // 😏 when multiple updates are scheduled
    // return a future `false` and decrement the count
    if (this._updateRequests === 1) {
      // 🧪 while testing, update count is kept on record
      // to test performances
      if (process.env.NODE_ENV === 'test') {
        if (this._$$updatesCount === null) {
          this._$$updatesCount = 0
        }
        this._$$updatesCount += 1
      }

      // ⛏️ get config file
      if (typeof this._configSrc === 'string') {
        const config = await fetchConfig(this._configSrc)
        this._config = mergeConfig(config)
      }

      // 1 => import-map 💹
      updateGlobalImportapMap.call<Microlc<E>, [], void>(this)

      // then render to ensure that mount point is in page
      // layout is attached with its own importmap
      // 2 => render 📝
      await this.render()

      // 3 => applications 🍎
      await updateApplications.call<Microlc<E>, [], Promise<void>>(this)

      return Promise.resolve(true).finally(() => this._completeUpdate())
    }

    this._updateRequests -= 1
    return Promise.resolve(false)
  }

  async render(): Promise<void> {
    // render is made of two seperate
    // areas:
    //  1. layout (do not depend on `window.location.href`)
    //  2. application (does depend on `window.location.href`)
    const {
      _config: {
        layout,
        settings: {
          pluginMountPointSelector,
        },
      },
    } = this

    // layout composition and premount ops
    const { content } = await premount
      .call<Microlc<E>, [HTMLScriptElement, PluginConfiguration], Promise<ResolvedConfig>>(this, this._layoutImportmap, layout)
    !this._layoutImportmap.isConnected && this.ownerDocument.head.appendChild(this._layoutImportmap)
    const layoutAppender = await createComposerContext(content, {
      context: { microlcApi: this.getApi() },
      extraProperties: ['microlcApi'],
    })

    // if shadow dom is used
    // ==> append layout inside
    // ==> append qiankun as regular child
    if (this._isShadow()) {
      layoutAppender(this._shadowRoot)
      litHtmlRender(
        template(pluginMountPointSelector),
        this
      )
    // if not append anything as regular child
    } else {
      layoutAppender(this)
    }
  }

  disconnectedCallback() {
    // remove all tags related with microlc
    [...this._styleTags, this._globalImportmap, this._layoutImportmap].forEach((el) => {
      el.remove()
    })
    this._applicationsImportMap.removeAll()

    // disconnect event listeners
    removeRouter.call<Microlc<E>, [], void>(this)

    // notify in case of re-connection
    this._wasDisconnected = true
  }
}
