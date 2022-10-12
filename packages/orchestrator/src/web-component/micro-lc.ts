import { createComposerContext, premount } from '@micro-lc/composer'
import type { Config } from '@micro-lc/interfaces/v2'
import { camelCase, kebabCase } from 'lodash-es'
import type { LoadableApp } from 'qiankun'

import type { CompleteConfig } from '../config'
import { mergeConfig, defaultConfig } from '../config'

import type { MicrolcApi, ComposableApplicationProperties, BaseExtension } from './lib'
import { MatchCache,
  rerouteToError,
  createMicrolcApiInstance,
  createRouter,
  removeRouter,
  reroute,
  rerouteErrorHandler,
  fetchConfig,
  handleInitImportMapError,
  initImportMapSupport,
  updateApplications,
  updateGlobalImportMap,
  initBaseExtensions } from './lib'
import { createQiankunInstance } from './lib/qiankun'

type ObservedAttributes =
  | 'config-src'
  | 'disable-shadow-dom'
type ObservedProperties =
  | 'config'
  | 'configSrc'
  | 'disableShadowDom'

const booleanAttributes: ObservedAttributes[] = ['disable-shadow-dom']

const handleUpdateError = (_: TypeError): void => {
  console.error(_)
}

export class Microlc<E extends BaseExtension = BaseExtension> extends HTMLElement {
  static get observedAttributes() { return ['config-src', 'disable-shadow-dom'] }

  private _wasDisconnected = false
  private _updateComplete = true
  protected _updateRequests = 0
  protected _$$updatesCount: number | null = null
  protected _instance = window.crypto.randomUUID()

  protected _config!: CompleteConfig
  protected _configSrc: string | null | undefined
  protected _disableShadowDom: boolean | undefined

  // queries
  protected _styleElements: HTMLStyleElement[] = []
  protected _loadedApps = new Map<string, [string | undefined, LoadableApp<ComposableApplicationProperties<E>>]>()
  protected _loadedRoutes = new Map<string, string>()
  protected _applicationMapping = new Map<string, string>()
  protected _matchCache = new MatchCache<E>()
  protected _reroute = reroute.bind<(url?: string | undefined) => Promise<void>>(this)
  protected _rerouteToError = rerouteToError.bind<(statusCode?: number) => Promise<void>>(this)

  // properties/attributes update
  protected _prepareForUpdate() {
    this._updateRequests += 1
    this._updateComplete = false
  }

  protected _completeUpdate() {
    this._updateRequests = 0
    this._updateComplete = true
  }

  protected _handlePropertyChange(name: ObservedProperties, value: unknown): void {
    switch (name) {
    case 'config':
      this._configSrc = null
      this.removeAttribute('config-src')

      this._prepareForUpdate()

      this._handlePropertyUpdate(
        'config',
        mergeConfig(value as Config),
      )
      break
    case 'configSrc':
      if (value !== this._configSrc) {
        this._prepareForUpdate()

        this._handlePropertyUpdate(
          'configSrc',
          value,
          (input): input is string => typeof input === 'string'
        )
      }
      break
    case 'disableShadowDom':
      if (value !== this._disableShadowDom) {
        this._prepareForUpdate()

        this._handlePropertyUpdate(
          'disableShadowDom',
          value,
          (input): input is boolean => typeof input === 'boolean'
        )
      }
      break
    default:
      break
    }
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
        .then((done) => {
          if (done) {
            // rerouting
            this._matchCache.invalidateCache()
            this._reroute().catch(rerouteErrorHandler)

            // signal webcomponent end of update
            this._completeUpdate()

            // signal load finished
            this.onload?.call(window, new Event('load'))
          }
        })
        .catch(handleUpdateError)
    })
  }

  get config(): CompleteConfig | undefined {
    return this._config
  }

  set config(src: unknown) {
    this._handlePropertyChange('config', src)
  }

  /**
   * @observedProperty --> mirrored by `config-src`
   */
  get configSrc(): string | null | undefined {
    return this._configSrc
  }
  set configSrc(src: unknown) {
    this._handlePropertyChange('configSrc', src)
  }

  /**
   * @observedProperty --> mirrored by `disable-shadow-dom`
   */
  get disableShadowDom(): boolean | undefined {
    return Boolean(this._disableShadowDom)
  }
  set disableShadowDom(disable: unknown) {
    this._handlePropertyChange('disableShadowDom', disable)
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

  getApi: () => MicrolcApi<E> = createMicrolcApiInstance
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

    // first update
    this._handlePropertyChange('config', this.config ?? defaultConfig)
    this._handlePropertyChange('disableShadowDom', this.disableShadowDom ?? false)
    this.configSrc !== undefined && this._handlePropertyChange('configSrc', this.configSrc)
  }

  connectedCallback() {
    if (this._wasDisconnected && this._disableShadowDom) {
      this._styleElements.forEach((element) => {
        this.ownerDocument.head.appendChild(element)
      })
    }

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
      await initImportMapSupport().catch(handleInitImportMapError)
      await updateGlobalImportMap(this._config.importmap)

      // then render to ensure that mount point is in page
      // layout is attached with its own importmap
      // 2 => render 📝
      await this.render()

      // 3 => applications 🍎
      await updateApplications.call<Microlc<E>, [], Promise<void>>(this)

      return Promise.resolve(true)
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
          mountPoint,
        },
      },
    } = this

    for (const child of this.children) {
      child.remove()
    }
    for (const child of this._shadowRoot.children) {
      child.remove()
    }

    // layout composition and premount ops
    const { content } = await premount(layout)
    const layoutAppender = await createComposerContext(content, {
      context: { microlcApi: this.getApi() },
      extraProperties: ['microlcApi'],
    })
    const mountPointAppender = await createComposerContext(mountPoint)

    // if shadow dom is used
    // ==> append layout inside
    // ==> append qiankun as regular child
    if (this._isShadow()) {
      layoutAppender(this._shadowRoot)
      mountPointAppender(this)
    // if not append anything as regular child
    } else {
      layoutAppender(this)
    }
  }

  disconnectedCallback() {
    // remove all tags related with microlc
    this._styleElements.forEach((el) => {
      el.remove()
    })

    // disconnect event listeners
    removeRouter.call<Microlc<E>, [], void>(this)

    // notify in case of re-connection
    this._wasDisconnected = true
  }
}
