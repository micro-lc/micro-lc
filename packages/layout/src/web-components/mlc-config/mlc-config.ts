import type { BaseExtension, MicrolcApi } from '@micro-lc/orchestrator'
import { defaultConfig } from '@micro-lc/orchestrator'
import type { PropertyValueMap } from 'lit'
import { unsafeCSS, css, html, LitElement } from 'lit'
import { property, query, state } from 'lit/decorators.js'

import monacoStyle from './mlc-config.css'
import * as monaco from './worker'
import type { IStandaloneCodeEditor, IEditorAction } from './worker'

interface Resizable extends HTMLElement {
  _w: number
  _x: number
  element: HTMLElement
  mouseMoveHandler: (event: MouseEvent) => void
  mouseUpHandler: (event: MouseEvent) => void
}

function mouseMoveHandler(this: Resizable, event: MouseEvent): void {
  const dx = event.clientX - this._x
  this.element.style.width = `${this._w + dx}px`
}

function mouseUpHandler(this: Resizable): void {
  const { ownerDocument: document } = this

  document.removeEventListener('mousemove', this.mouseMoveHandler)
  document.removeEventListener('mouseup', this.mouseUpHandler)
}

function mouseDownHandler(this: Resizable, event: MouseEvent): void {
  const { ownerDocument: document } = this

  const styles = window.getComputedStyle(this.element)
  const borderWidth = parseInt(styles.borderRightWidth, 10)

  this._x = event.clientX
  this._w = parseInt(styles.width, 10)

  const borderDelta = Math.abs(event.clientX - this._w)

  if (borderDelta < borderWidth) {
    document.addEventListener('mousemove', this.mouseMoveHandler)
    document.addEventListener('mouseup', this.mouseUpHandler)
  }
}

function handleSlotChange(this: MlcConfig, { target }: Event) {
  if (target instanceof HTMLSlotElement) {
    const interval = setInterval(() => {
      const iframe = this.ownerDocument.querySelector(this.iframeSelector)
      if (iframe instanceof HTMLIFrameElement) {
        clearInterval(interval)
        this.handleSubmit(iframe)
      }
    }, 100)
  }
}

interface Submittable {
  submitButton: HTMLButtonElement
}

function ctrlEnterClickHandler(this: Submittable, event: KeyboardEvent) {
  event.stopPropagation()
  if (event.key === 'Enter' && event.ctrlKey) {
    this.submitButton.click()
  }
}

export class MlcConfig extends LitElement implements Resizable, Submittable {
  static styles = [css`
    :host {
      position: relative;
      display: flex;
      width: 100%;
      height: 100%;
    }

    .half {
      resize: horizontal;
      display: flex;
      flex-direction: column;
      width: inherit;
      height: 100%;
    }

    .resizer-l {
      left: 0;
      border-right: 5px solid rgba(0, 0, 0, 0.05);
      cursor: col-resize;
    }
    
    .default-cursor {
      cursor: default;
    }

    .top-area {
      width: 100%;
      height: 10%;
      align-items: center;
      display: flex;
      justify-content: center;
    }

    .editor {
      width: 100%;
      height: 90%;
    }
      
    :host {
      --background: #fff;
    }

    .button {
      --text: #1a36b0;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      border: 0.5px solid #a8a4a4;
      padding: 0;
      width: 140px;
      height: 32px;
      background: none;
      color: var(--text);
      cursor: pointer;
      outline: none;
    }

    .button:hover {
      filter: brightness(50%);
    }
  `, unsafeCSS(monacoStyle)]

  @state() private _content = JSON.stringify(defaultConfig)
  private _editor?: IStandaloneCodeEditor | undefined

  @property({ attribute: 'iframe-selector' }) iframeSelector = 'iframe'

  @property({ attribute: 'init-content' })
  set initContent(init: unknown) {
    if (typeof init === 'string') {
      this._content = init
    } else {
      this._content = JSON.stringify(init)
    }
  }

  @query('#editor-container') container!: HTMLDivElement

  @query('#submit-button') submitButton!: HTMLButtonElement

  @query('#left-section') element!: HTMLElement

  _x = 0
  _w = 0
  mouseMoveHandler = mouseMoveHandler.bind<(event: MouseEvent) => void>(this)
  mouseDownHandler = mouseDownHandler.bind<(event: MouseEvent) => void>(this)
  mouseUpHandler = mouseUpHandler.bind<(event: MouseEvent) => void>(this)
  handleSlotChange = handleSlotChange.bind(this)
  ctrlEnterClickHandler = ctrlEnterClickHandler.bind<(event: KeyboardEvent) => void>(this)
  microlcApi?: Partial<MicrolcApi<BaseExtension>> | undefined

  protected createRenderRoot(): ShadowRoot {
    const shadowRoot = super.createRenderRoot() as ShadowRoot
    this.appendChild(this.ownerDocument.createElement('slot'))
    return shadowRoot
  }

  connectedCallback(): void {
    super.connectedCallback()
    window.addEventListener('keypress', this.ctrlEnterClickHandler)
  }
  disconnectedCallback(): void {
    super.disconnectedCallback()
    window.removeEventListener('keypress', this.ctrlEnterClickHandler)
  }

  protected firstUpdated(_changedProperties: PropertyValueMap<unknown> | Map<PropertyKey, unknown>): void {
    super.firstUpdated(_changedProperties)
    this._editor = monaco.editor.create(this.container, {
      automaticLayout: true,
      language: 'json',
      tabSize: 2,
      value: this._content,
    })
    this._editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      window.dispatchEvent(new KeyboardEvent('keypress', { ctrlKey: true, key: 'Enter' }))
    })
  }

  protected handleSubmit(_: MouseEvent | HTMLIFrameElement): void {
    let iframe = _ as HTMLIFrameElement | null
    if (!(iframe instanceof HTMLIFrameElement)) {
      iframe = this.ownerDocument.querySelector(this.iframeSelector)
    }
    console.log(_, iframe)

    if (this._editor) {
      iframe?.contentWindow?.postMessage(this._editor.getValue(), window.location.origin)
    }
  }

  protected updated(changedProperties: PropertyValueMap<{_content?: string}>): void {
    super.updated(changedProperties)

    if (changedProperties.has('_content')) {
      typeof this._content === 'string' && this._editor?.setValue(this._content)
      const formatAction = this._editor?.getAction('editor.action.formatDocument') as IEditorAction | null

      if (formatAction) {
        setTimeout(() => {
          formatAction.run().catch(console.error)
        }, 200)
      } else {
        console.warn('no format action available')
      }
    }
  }

  protected render(): unknown {
    return html`
      <section
        id="left-section"
        class="half resizer-l"
        @mousedown=${this.mouseDownHandler}
      >
        <div class="top-area default-cursor">
          <button
            id="submit-button"
            role="button"
            class="button"
            @click=${(event: MouseEvent) => this.handleSubmit(event)}
          >Send (Ctrl+\u21a9)</button>
        </div>
        <div class="editor default-cursor" id="editor-container"></div>
      </section>
      <section class="half">
        <slot @slotchange=${this.handleSlotChange}></slot>
      </section>
    `
  }
}
