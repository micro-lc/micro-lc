import type { Config } from '@micro-lc/interfaces'

import type { MicrolcApiInstance } from './api'
import type { CompleteConfig } from './config'
import { defaultConfig, mergeConfig } from './config'
import { appendImportMapTag, appendStyleTag } from './dom'
import { run } from './run'
import { invalidJsonCatcher, jsonFetcher, jsonToObject, jsonToObjectCatcher } from './utils/json'
import Subscription from './utils/subscription'

const MICRO_LC_CONFIG = '"micro-lc config"'

type Obj = Record<string, never>

export default class MicroLC<T extends Obj = Obj> extends HTMLElement {
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
      const config = await jsonToObject<Config>(json)
        .catch((err: TypeError) =>
          jsonToObjectCatcher<Config>(
            err, defaultConfig(this.isShadowDom()), MICRO_LC_CONFIG
          )
        )
      const completeConfig = mergeConfig.call(this, config)
      this._config = completeConfig

      // SETUP & START
      await run.call(this, this._config).finally(() => {
        this._updateCompleted = true
      })
    })
  }

  protected mountPoint?: string | HTMLElement

  protected styleTags: HTMLStyleElement[] = []

  protected importmap: HTMLScriptElement | null = null

  protected api?: MicrolcApiInstance<T>

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
      appendImportMapTag.call(this)
      this.styleTags.length > 0
        && this.styleTags.forEach((style) => { appendStyleTag.call(this, style) })
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
