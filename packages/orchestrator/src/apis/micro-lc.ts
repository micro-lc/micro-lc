import type { Config } from '@micro-lc/interfaces'

import type { CompleteConfig } from '../config'
import { mergeConfig, defaultConfig } from '../config'
import { appendImportMapTag, appendStyleTag, SideEffectMap } from '../dom'
import type { SchemaOptions } from '../utils/json'
import { jsonToObject, jsonToObjectCatcher, invalidJsonCatcher, jsonFetcher } from '../utils/json'
import Subscription from '../utils/subscription'

import type { MicrolcApi } from './core'
import { createMicrolcApiInstance } from './core'
import type { BaseExtension } from './extensions'
import { initBaseExtensions } from './extensions'
import { update } from './micro-lc.lib'
import type { QiankunApi } from './qiankun'
import { createQiankunInstance } from './qiankun'

const MICRO_LC_CONFIG = '"micro-lc config"'

export default class MicroLC<
  Extensions extends BaseExtension = BaseExtension,
> extends HTMLElement {
  static get observedAttributes() { return ['config-src'] }

  private _wasDisconnected = false

  private _updateCompleted = true

  /** @state */
  private _config: CompleteConfig | undefined

  private _configSrc?: string

  private _subscription = new Subscription()

  private _handleConfigSrcChange(url: string | undefined): void {
    typeof url === 'string'
      && this._configSrc !== url
      && this._subscription.add(async () => {
        const config = await jsonFetcher(url)
          .then((json) => {
            this._configSrc = url
            return json
          })
          .catch((err: TypeError) =>
            invalidJsonCatcher<Config>(
              err,
              defaultConfig(this.isShadowDom()),
              MICRO_LC_CONFIG
            )
          )
        this._handleConfigChange(config)
      })
  }

  private _handleConfigChange(json: unknown): void {
    this._subscription.add(async () => {
      let schema: SchemaOptions | undefined
      if (process.env.NODE_ENV === 'development') {
        schema = await import('../utils/schemas').then<SchemaOptions>((schemas) => ({
          id: schemas.configSchema.$id,
          parts: schemas,
        }))
      }

      const config = await jsonToObject<Config>(json, schema)
        .catch((err: TypeError) =>
          jsonToObjectCatcher<Config>(
            err, defaultConfig(this.isShadowDom()), MICRO_LC_CONFIG
          )
        )

      const completeConfig = mergeConfig.call(this, config)
      this._config = completeConfig

      // SETUP & START
      await update.call<MicroLC<Extensions>, [], Promise<void>>(this).finally(() => {
        this._updateCompleted = true
      })
    })
  }

  protected mountPoint: string | HTMLElement | null = null

  protected styleTags: HTMLStyleElement[] = []

  protected importmap: HTMLScriptElement | null = null

  protected applicationsImportMaps = new SideEffectMap<Extensions>(this)

  protected extensions: Extensions = initBaseExtensions
    .call<MicroLC<Extensions>, [], Extensions>(this)

  protected qiankun: QiankunApi = createQiankunInstance
    .call<MicroLC<Extensions>, [], QiankunApi>(this)

  protected getApi: () => MicrolcApi<Extensions> = createMicrolcApiInstance
    .call<MicroLC<Extensions>, [], () => MicrolcApi<Extensions>>(this)

  get updateCompleted(): boolean {
    return this._updateCompleted
  }

  set config(json: unknown) {
    this._updateCompleted = false
    this._handleConfigChange(json)
    this.removeAttribute('config-src')
  }

  get config(): CompleteConfig {
    /*
     * SAFETY: Cannot be called before `connectedCallback` method
     * where this._config is definitively defined
     */
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this._config!
  }

  set configSrc(configSrc: string | undefined) {
    this._updateCompleted = false
    this._handleConfigSrcChange(configSrc)
  }

  get configSrc(): string | undefined {
    return this._configSrc
  }

  get renderRoot(): this | ShadowRoot {
    return this.shadowRoot ?? this
  }

  isShadowDom() {
    return this.renderRoot instanceof ShadowRoot
  }

  connectedCallback() {
    const enableShadowDom = this.getAttribute('disable-shadow-dom') === null
    if (enableShadowDom && this.shadowRoot === null) {
      this.attachShadow({ mode: 'open' })
    }

    if (this._config === undefined) {
      this._config = defaultConfig(enableShadowDom)
    }

    // reconnect checks
    if (this._wasDisconnected) {
      appendImportMapTag.call<MicroLC<Extensions>, [], void>(this)
      this.styleTags.length > 0
        && this.styleTags.forEach((style) => {
          appendStyleTag.call<MicroLC<Extensions>, [HTMLStyleElement], HTMLStyleElement>(
            this,
            style
          )
        })
    }

    this._wasDisconnected = false
  }

  attributeChangedCallback(name: string, _: string | null, newValue: string | null): void {
    if (name === 'config-src') {
      this._updateCompleted = false
      this._handleConfigSrcChange(newValue ?? undefined)
    }
  }

  disconnectedCallback() {
    this._subscription.unsubscribe()
    this.styleTags.forEach((tag) => tag.isConnected && tag.remove())
    this.importmap?.isConnected && this.importmap.remove()

    // disconnect
    this._wasDisconnected = true
  }
}
