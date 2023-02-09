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
import type { PropertyValues } from 'lit'
import { css, html, LitElement } from 'lit'
import { property, state } from 'lit/decorators.js'

const originRegex = /^https?:\/\/(?=.{1,254}(?::|$))(?:(?!\d|-)(?![a-z0-9-]{1,62}-(?:\.|:|$))[a-z0-9-]{1,63}\b(?!\.$)\.?)+(:\d+)?$/i

function popStateListener(this: MlcUrl, event: PopStateEvent) {
  console.log(event)
  const { location: { href } } = event.target as Window
  this._value = href
}

export class MlcUrl extends LitElement {
  static styles = css`
    div {
      display: inline-flex;
      width: 100%;
      gap: 16px;
    }

    button {
      all: unset;
      height: 32px;
      padding: 8px;
      box-sizing: border-box;
      background-color: #de1f92;
      border-radius: 4px;
      box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
    }

    button:hover {
      background-color: #c81c83
    }

    input {
      height: 32px;
      background: white;
      font-family: Roboto, Helvetica, Arial, sans-serif;
      font-size: 1em;
      line-height: 1.2;
      padding: 0.5em 0 0.35em 8px;
      letter-spacing: inherit;
      color: currentColor;
      border: 0;
      box-sizing: border-box;
      margin: 0;
      display: block;
      min-width: 0;
      width: 100%;
      min-height: 32px;
      border-radius: 4px;
      border: 1px solid rgba(0, 0, 0, 0.23);
    }

    input:focus-visible {
      border: 1px solid #de1f92;
      outline: none;
    }

    input[disabled] {
      background-color: rgba(239, 239, 239, 0.3);
      color: rgb(84, 84, 84);
      border-color: rgba(118, 118, 118, 0.3);
    }
  `

  popStateListener = popStateListener.bind(this)

  connectedCallback(): void {
    const { ownerDocument: { defaultView: window } } = this
    super.connectedCallback()
    window?.addEventListener('popstate', this.popStateListener)
  }

  disconnectedCallback(): void {
    const { ownerDocument: { defaultView: window } } = this
    super.connectedCallback()
    window?.addEventListener('popstate', this.popStateListener)
  }

  replaceOrigin() {
    const { matcher, _value } = this
    // if origin matches matcher, it should replace it with
    // the content of origin
    if (matcher?.match(originRegex) !== null && this.origin?.match(originRegex) !== null) {
      const { origin, href } = new URL(_value)
      const nextOrigin = origin.includes(matcher as string) ? this.origin as string : origin
      const nextHref = href.replace(origin, nextOrigin)
      try {
        this._value = new URL(nextHref).href
      } catch {
        /* no-op */
      }
    }
  }

  @state() protected _value = new URL(this.ownerDocument.baseURI, window.location.origin).href

  @property() matcher: string | null = null

  @property() origin: string | null = null

  protected update(changedProperties: PropertyValues<this>): void {
    super.update(changedProperties)

    this.replaceOrigin()
  }

  protected render(): unknown {
    return html`
      <div>
        <button @click=${() => this.ownerDocument.defaultView?.history.back()}>
          <mlc-iconic
            library="@fortawesome/free-solid-svg-icons"
            selector="faChevronLeft"
            style="color: white; width: 16px; height: 16px; display: block; stroke-width: 1px;"
          ></mlc-iconic>
        </button>
        <input type="url" disabled .value=${this._value}></input>
      </div>
    `
  }
}


