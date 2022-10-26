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


