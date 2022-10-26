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
import { createComposerContext, premount } from '@micro-lc/composer'
import type { Config, Content } from '@micro-lc/interfaces/v2'
import { camelCase, kebabCase } from 'lodash-es'
import type { LoadableApp } from 'qiankun'

import type { CompleteConfig } from '../config'
import { mergeConfig, defaultConfig } from '../config'
import { craftLanguageHeader } from '../utils/lang'

import type {
  MicrolcApi,
  ComposableApplicationProperties,
  BaseExtension,
  RouterContainer,
  QiankunApi } from './lib'
import {
  handleUpdateError,
  getUnmount,
  currentApplication$,
  rerouteToError,
  MatchCache,
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
  initBaseExtensions,
  createQiankunInstance,
} from './lib'

type ObservedAttributes =
  | 'config-src'
type ObservedProperties =
  | 'config'
  | 'configSrc'


export class Microlc<
  E extends BaseExtension = BaseExtension
> extends HTMLElement implements RouterContainer {
  static get observedAttributes() { return ['config-src'] }

  private _wasDisconnected = false
  private _updateComplete = true
  protected _updateRequests = 0
  protected _$$updatesCount: number | null = null
  protected _instance = window.crypto.randomUUID()

  protected _config!: CompleteConfig
  protected _configSrc: string | null | undefined
  protected _disableShadowDom: boolean | undefined
  protected _reroute = reroute.bind(this)
  protected _rerouteToError = rerouteToError.bind(this)
  protected _qiankun = createQiankunInstance()

  // queries
  protected _styleElements: HTMLStyleElement[] = []

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
            this.matchCache.invalidateCache()
            this._reroute().catch(rerouteErrorHandler)

            // signal webcomponent end of update
            this._completeUpdate()

            // signal load finished
            this.onload?.call(window, new Event('load'))
          }
        })
        .catch((err: TypeError) => handleUpdateError(currentApplication$, err))
    })
  }

  get config(): CompleteConfig {
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

  get updateComplete(): boolean {
    return this._updateComplete
  }

  get $$updatesCount(): number | null {
    return this._$$updatesCount
  }


  // 🚥 router
  loadedApps = new Map<string, [string | undefined, LoadableApp<ComposableApplicationProperties>]>()
  loadedRoutes = new Map<string, string>()
  applicationMapping = new Map<string, string>()
  matchCache = new MatchCache()
  get qiankun(): QiankunApi {
    return this._qiankun
  }
  get instance(): string {
    return this._instance
  }

  // 🐝 api
  protected _extensions: E = initBaseExtensions.call<Microlc<E>, [], E>(this)

  getApi: () => MicrolcApi<E> = createMicrolcApiInstance
    .call<Microlc<E>, [], () => MicrolcApi<E>>(this)


  // DOM
  protected _style: HTMLStyleElement
  protected _container: HTMLDivElement

  constructor() {
    super()

    const shadow = this.getAttribute('disable-shadow-dom') === null
    const microlcRootId = this.getAttribute('root-id') ?? '__micro_lc'
    if (shadow) {
      this.attachShadow({ mode: 'open' })
    }

    // one-off style
    const appendStyle = this.getAttribute('disable-styling') === null
    this._style = Object.assign(
      this.ownerDocument.createElement('style'), {
        textContent: `
          div#__micro_lc {
            width: 100%;
            height: 100%;
          }

          div#__micro_lc > :first-child {
            width: inherit;
            height: inherit;
            overflow: hidden
          }
        `,
      }
    )
    appendStyle && this.appendChild(this._style)

    this._container = this.ownerDocument.createElement('div')
    this._container.setAttribute('id', microlcRootId)
    this.appendChild(this._container)

    // first update
    this._handlePropertyChange('config', (this.config as CompleteConfig | undefined) ?? defaultConfig)
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
    if (newValue === '') {
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
        const headers = craftLanguageHeader(
          this.getApi().getExtensions().language?.getLanguage()
        )
        const config = await fetchConfig(this._configSrc, { headers })
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
          mountPointSelector,
        },
        shared: {
          properties,
        },
      },
    } = this

    const unmount = getUnmount()
    await unmount?.().catch(rerouteErrorHandler)

    if (this.shadowRoot) {
      Array.from(this.shadowRoot.children).forEach((child) => {
        child.remove()
      })
    }
    Array.from(this._container.children).forEach((child) => {
      child.remove()
    })

    // layout composition and premount ops
    const { content } = await premount(layout)
    const composerByContent = async (conf: Content) => createComposerContext(conf, {
      context: { composerApi: { createComposerContext, premount }, microlcApi: this.getApi(), ...properties },
      extraProperties: new Set(['microlcApi', 'composerApi', ...Object.keys(properties)]),
    })
    const layoutAppender = await composerByContent(content)

    // if shadow dom is used
    // ==> append layout inside
    // ==> append qiankun as regular child
    if (this.shadowRoot) {
      layoutAppender(this.shadowRoot)
    }

    if (mountPoint) {
      // 'development' failsafe
      let isDomMountable = false
      if (process.env.NODE_ENV === 'development') {
        if (mountPointSelector !== undefined) {
          const mountPointAppender = await composerByContent(mountPoint)
          const temporaryMountPoint = this.ownerDocument.createElement('div')
          mountPointAppender(temporaryMountPoint)
          isDomMountable = temporaryMountPoint.querySelector(mountPointSelector) !== null
        }
      } else {
        isDomMountable = true
      }

      if (isDomMountable) {
        const mountPointAppender = await composerByContent(mountPoint)
        mountPointAppender(this._container)
      }
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
