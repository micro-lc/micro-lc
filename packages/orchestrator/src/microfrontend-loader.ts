import type { MicrolcApi, MFELoader, RoutelessApplication } from './web-component'

interface State {
  application: RoutelessApplication | undefined
  loader: MFELoader | undefined
}

const COMPOSER_BODY_CLASS = 'composer-body'

const isSameApplication = (current: RoutelessApplication | undefined, next: RoutelessApplication | undefined) => {
  if (current === undefined && next === undefined) {
    return false
  }

  if (current === undefined || next === undefined) {
    return false
  }

  return JSON.stringify(current) === JSON.stringify(next)
}

class MicrofrontendLoader extends HTMLElement {
  private container: HTMLElement | ShadowRoot = this
  private state: State = { application: undefined, loader: undefined }
  private initialResolve: (() => void) | undefined
  private queue = new Promise<void>((resolve) => {
    this.initialResolve = resolve
  })
  private enqueue(fn: () => unknown) {
    this.queue = this.queue.then(() => {
      const result = fn()
      return result !== null && typeof result === 'object' && 'then' in result
        ? result
        : Promise.resolve(result)
    }).then(() => { /* no-op */ })
  }

  microlcApi?: MicrolcApi

  set application(application: RoutelessApplication | undefined) {
    if (!isSameApplication(this.state.application, application)) {
      this.enqueue(() => this.update('application', { application }))
    }
  }

  get application(): RoutelessApplication | undefined {
    return this.state.application
  }

  connectedCallback() {
    let renderRoot: HTMLElement | ShadowRoot = this
    const disableShadowDom = this.getAttribute('disable-shadow-dom') !== null
    const disableStyling = this.getAttribute('disable-styling') !== null

    if (this.state.loader === undefined) {
      this.state.loader = this.microlcApi?.createLoader()
    }

    const id = `_${window.crypto.randomUUID()}`
    const container = Object.assign(
      this.ownerDocument.createElement('div'), { id }
    )
    const style = Object.assign(
      this.ownerDocument.createElement('style'),
      {
        textContent: `
          div#${id} {
            width: 100%;
            height: 100%;
            overflow: hidden;
          }

          div#${id} > :first-child {
            width: inherit;
            height: inherit;
            overflow: hidden;
          }

          div#${id} > :first-child > div.${COMPOSER_BODY_CLASS} {
            width: inherit;
            height: inherit;
            overflow: hidden;
          }
        `,
      }
    )

    if (!disableShadowDom) {
      renderRoot = this.attachShadow({ mode: 'open' })
    }

    !disableStyling && renderRoot.appendChild(style)
    this.container = renderRoot.appendChild(container)
    this.initialResolve?.()
  }

  private async update(name: keyof State, next: Partial<State>) {
    if (name === 'application') {
      await this.state.loader?.unload()

      if (next.application !== undefined) {
        await this.state.loader?.load(next.application, this.container)
      }

      this.state.application = next.application
    }
  }

  disconnectedCallback() {
    const { state: { loader } } = this
    this.enqueue(() => loader?.unload())
  }
}

customElements.define('microfrontend-loader', MicrofrontendLoader)
