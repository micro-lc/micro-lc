import { invalidJsonCatcher, jsonFetcher, jsonToObject, jsonToObjectCatcher } from './utils/json'
import Subscription from './utils/subscription'

type Config = Record<string, any>

const MICRO_LC_CONFIG = '"micro-lc config"'

const defaultConfig: Config = {}

export default class MicroLC extends HTMLElement {
  static get observedAttributes() { return ['config-src'] }

  /** @state */
  private _config: Config = {}

  private _configSrc?: string

  private _subscription = new Subscription()

  private _handleConfigSrcChange(url: string): void {
    this._subscription.add(async () => {
      const config = await jsonFetcher(url)
        .then((json) => {
          this._configSrc = url
          return json
        })
        .catch((err: TypeError) => invalidJsonCatcher(err, defaultConfig, MICRO_LC_CONFIG))
      this._handleConfigChange(config)
    })
  }

  private _handleConfigChange(json: unknown): void {
    this._subscription.add(async () => {
      const config = await jsonToObject<Config>(json)
        .catch((err: TypeError) => jsonToObjectCatcher(err, defaultConfig, MICRO_LC_CONFIG))
      Object.assign(this, { _config: config })
    })
  }

  set config(json: unknown) {
    this._handleConfigChange(json)
    this.removeAttribute('config-src')
  }

  get config(): Config {
    return this._config
  }

  set configSrc(configSrc: string | undefined) {
    this._configSrc = configSrc
  }

  get configSrc(): string | undefined {
    return this._configSrc
  }

  get renderRoot(): this | ShadowRoot {
    return this.shadowRoot ?? this
  }

  connectedCallback() {
    if (this.getAttribute('shadow-dom') !== null) {
      this.attachShadow({ mode: 'open' })
    }
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (name === 'config-src') {
      typeof newValue === 'string'
        && oldValue !== newValue
        && this._handleConfigSrcChange(newValue)
    }
  }

  disconnectedCallback() {
    this._subscription.unsubscribe()
  }
}

