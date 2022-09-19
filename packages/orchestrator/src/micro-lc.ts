import type { Config } from '@micro-lc/interfaces'

import { setup } from './apis'
import type { CompleteConfig } from './config'
import { defaultConfig, mergeConfig } from './config'
import { invalidJsonCatcher, jsonFetcher, jsonToObject, jsonToObjectCatcher } from './utils/json'
import Subscription from './utils/subscription'

const MICRO_LC_CONFIG = '"micro-lc config"'

export default class MicroLC extends HTMLElement {
  static get observedAttributes() { return ['config-src'] }

  #updateCompleted = true

  /** @state */
  #config!: CompleteConfig

  #configSrc?: string

  #subscription = new Subscription()

  private _handleConfigSrcChange(url: string | undefined): void {
    typeof url === 'string'
      && this.#configSrc !== url
      && this.#subscription.add(async () => {
        const config = await jsonFetcher(url)
          .then((json) => {
            this.#configSrc = url
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
    this.#subscription.add(async () => {
      const config = await jsonToObject<Config>(json)
        .catch((err: TypeError) =>
          jsonToObjectCatcher<Config>(
            err, defaultConfig(this.isShadowDom()), MICRO_LC_CONFIG
          )
        )
      const completeConfig = mergeConfig.call(this, config)
      this.#config = completeConfig

      // SETUP & START
      await setup.call(this, this.#config).finally(() => {
        this.#updateCompleted = true
      })
    })
  }

  get updateCompleted(): boolean {
    return this.#updateCompleted
  }

  set config(json: unknown) {
    this.#updateCompleted = false
    this._handleConfigChange(json)
    this.removeAttribute('config-src')
  }

  get config(): CompleteConfig {
    return this.#config
  }

  set configSrc(configSrc: string | undefined) {
    this.#updateCompleted = false
    this._handleConfigSrcChange(configSrc)
  }

  get configSrc(): string | undefined {
    return this.#configSrc
  }

  get renderRoot(): this | ShadowRoot {
    return this.shadowRoot ?? this
  }

  isShadowDom() {
    return this.renderRoot instanceof ShadowRoot
  }

  connectedCallback() {
    const enableShadowDom = this.getAttribute('disable-shadow-dom') === null
    if (enableShadowDom) {
      this.attachShadow({ mode: 'open' })
    }

    this.#config = defaultConfig(enableShadowDom)
  }

  attributeChangedCallback(name: string, _: string | null, newValue: string | null): void {
    if (name === 'config-src') {
      this.#updateCompleted = false
      this._handleConfigSrcChange(newValue ?? undefined)
    }
  }

  disconnectedCallback() {
    this.#subscription.unsubscribe()
  }
}

