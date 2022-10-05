import { css, html, LitElement } from 'lit'
import { state } from 'lit/decorators.js'

export class MlcUrl extends LitElement {
  static styles = css`
    input {
      box-sizing: border-box;
      padding: 10px 5px;
      margin: 20px;
      width: 100%;
      border-radius: 16px;
      font-size: medium;
      box-shadow: none;
    }
  `

  connectedCallback(): void {
    super.connectedCallback()
    window.addEventListener('popstate', this.popStateListener.bind(this))
  }

  popStateListener(event: PopStateEvent) {
    const { location: { href } } = event.target as Window
    this._value = href
  }

  @state() protected _value = new URL(this.ownerDocument.baseURI, window.location.origin).href

  protected handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault()
      const { value } = event.target as HTMLInputElement
      window.history.pushState(null, '', value)
    }
  }

  protected listenToPopState() {
    this.addEventListener('popstate', console.log)
  }

  protected render(): unknown {
    return html`
      <input
        @keypress=${(event: KeyboardEvent) => this.handleKeyPress(event)}
        .value=${this._value}
      ></input>
    `
  }
}


