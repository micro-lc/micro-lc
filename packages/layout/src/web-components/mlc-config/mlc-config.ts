import type { BaseExtension, MicrolcApi } from '@micro-lc/orchestrator'
import type { PropertyValueMap } from 'lit'
import { unsafeCSS, css, html, LitElement } from 'lit'
import { property, query, state } from 'lit/decorators.js'

import monacoStyle from './mlc-config.css'
import * as monaco from './worker'
import type { IStandaloneCodeEditor, IEditorAction, ITextModel } from './worker'
import { modelUri, yaml } from './yaml-support'

interface Resizable extends HTMLElement {
  _w: number
  _x: number
  left: HTMLElement
  mouseMoveHandler: (event: MouseEvent) => void
  mouseUpHandler: (event: MouseEvent) => void
  right: HTMLElement
}

function mouseMoveHandler(this: Resizable, event: MouseEvent): void {
  const dx = event.clientX - this._x
  this.left.style.width = `${this._w + dx}px`
  this.right.style.width = `${this._w - dx}px`
}

function mouseUpHandler(this: Resizable): void {
  this.removeEventListener('mousemove', this.mouseMoveHandler)
  this.removeEventListener('mouseup', this.mouseUpHandler)
}

function mouseDownHandler(this: Resizable, event: MouseEvent): void {
  const leftStyle = window.getComputedStyle(this.left)
  const rightStyle = window.getComputedStyle(this.right)
  const borderWidth = parseInt(leftStyle.borderRightWidth, 10)
   + parseInt(rightStyle.borderLeftWidth, 10)

  this._x = event.clientX
  this._w = parseInt(leftStyle.width, 10)

  const borderDelta = Math.abs(event.clientX - this._w)

  if (borderDelta < borderWidth) {
    console.log('here')
    this.addEventListener('mousemove', this.mouseMoveHandler)
    this.addEventListener('mouseup', this.mouseUpHandler)
  }
}

const bubbleIframeEvents = (iframe: HTMLIFrameElement) => {
  const iframeWindow = iframe.contentWindow

  iframeWindow?.addEventListener(
    'mousemove',
    (event) => {
      const boundingClientRect = iframe.getBoundingClientRect()
      const fakeEvent = new MouseEvent(
        'mousemove',
        {
          bubbles: true,
          cancelable: false,
          clientX: event.clientX + boundingClientRect.left,
          clientY: event.clientY + boundingClientRect.top,
        }
      )

      iframe.dispatchEvent(fakeEvent)
    }
  )

  iframeWindow?.addEventListener(
    'mousedown',
    () => {
      const fakeEvent = new CustomEvent(
        'mousedown',
        {
          bubbles: true,
          cancelable: false,
        }
      )
      iframe.dispatchEvent(fakeEvent)
    }
  )
}

function handleSlotChange(this: MlcConfig, { target }: Event) {
  if (target instanceof HTMLSlotElement) {
    const interval = setInterval(() => {
      const iframe = this.ownerDocument.querySelector(this.iframeSelector)
      if (iframe instanceof HTMLIFrameElement) {
        bubbleIframeEvents(iframe)
        clearInterval(interval)
        this.handleSubmit(iframe)
      }
    }, 100)
  }
}

enum EditorFormat {
  JSON = 'json',
  YAML = 'yaml',
}

function handleFormatChange(this: MlcConfig, event: Event, format: EditorFormat): void {
  if (this.editorFormat !== format) {
    switch (format) {
    case EditorFormat.YAML:
      this.yamlRadio.checked = true
      this.jsonRadio.checked = false
      break
    case EditorFormat.JSON:
    default:
      this.yamlRadio.checked = false
      this.jsonRadio.checked = true
      break
    }

    this.editorFormat = format
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

const defaultConfig = {
  version: 2,
}

export class MlcConfig extends LitElement implements Resizable, Submittable {
  static styles = [css`
    :host {
      position: relative;
      display: flex;
      width: 100%;
      height: 100%;
    }

    label {
      font-size: 12px;
      font-weight: 300;
    }

    .half-container {
      width: inherit;
      height: 100%;
      display: flex;
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
      border-right: 4px solid rgba(0, 0, 0, 0.05);
      cursor: col-resize;
    }
    
    .resizer-r {
      right: 0;
      border-left: 4px solid rgba(0, 0, 0, 0.05);
      cursor: col-resize;
    }
    
    .default-cursor {
      cursor: default;
    }

    .top-area {
      width: 100%;
      height: 15%;
      align-items: center;
      display: flex;
      justify-content: space-around;
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

  @state() editorFormat: EditorFormat = EditorFormat.JSON

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

  @query('#left-section') left!: HTMLElement

  @query('#right-section') right!: HTMLElement

  @query('#json') jsonRadio!: HTMLInputElement

  @query('#yaml') yamlRadio!: HTMLInputElement

  _x = 0
  _w = 0
  mouseMoveHandler = mouseMoveHandler.bind<(event: MouseEvent) => void>(this)
  mouseDownHandler = mouseDownHandler.bind<(event: MouseEvent) => void>(this)
  mouseUpHandler = mouseUpHandler.bind<(event: MouseEvent) => void>(this)
  handleSlotChange = handleSlotChange.bind(this)
  handleFormatChange = handleFormatChange.bind(this)
  ctrlEnterClickHandler = ctrlEnterClickHandler.bind<(event: KeyboardEvent) => void>(this)
  microlcApi?: Partial<MicrolcApi<BaseExtension>> | undefined
  models: Partial<Record<EditorFormat, ITextModel>> = {}

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

    this.models.json = monaco.editor.createModel(this._content, 'json')
    this.models.yaml = monaco.editor.createModel(yaml.dump(this._content), 'yaml', modelUri)

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
      const content = this._editor.getValue()
      console.log(content)
      const value = this.editorFormat === EditorFormat.JSON
        ? content
        : JSON.stringify(yaml.load(content))
      iframe?.contentWindow?.postMessage(value, window.location.origin)
    }
  }

  protected async formatText(): Promise<void> {
    const formatAction = this._editor?.getAction('editor.action.formatDocument') as IEditorAction | null
    return formatAction?.run()
  }

  protected update(changedProperties: Map<'editorFormat', EditorFormat>): void {
    super.update(changedProperties)

    if (changedProperties.has('editorFormat') && this._editor) {
      const content = this._editor.getValue()
      if (this.editorFormat === EditorFormat.YAML) {
        this._editor.setModel(null)
        this._editor.setModel(this.models.yaml ?? null)
        this._editor.setValue(yaml.dump(content))
      } else {
        this._editor.setModel(null)
        this._editor.setModel(this.models.json ?? null)
        this._editor.setValue(JSON.stringify(yaml.load(content)))
        this.formatText().catch(() => { /* noop */ })
      }
    }
  }

  protected updated(changedProperties: PropertyValueMap<{_content?: string}>): void {
    super.updated(changedProperties)

    if (changedProperties.has('_content')) {
      typeof this._content === 'string' && this._editor?.setValue(this._content)

      setTimeout(() => {
        this.formatText().catch(() => { /* noop */ })
      }, 200)
    }
  }

  protected render(): unknown {
    return html`
      <div class="half-container" @mousedown=${this.mouseDownHandler}>
        <section
          id="left-section"
          class="half resizer-l"
        >
          <div class="top-area default-cursor">
            <div style="display: flex; flex-direction: column;">
              <div>
                <input
                  type="radio" id="json" name="json" value="json" checked
                  @change=${(event: Event) => this.handleFormatChange(event, EditorFormat.JSON)}
                ><label for="json">JSON</label>
              </div>
              <div>
                <input
                  type="radio" id="yaml" name="yaml" value="yaml"
                  @change=${(event: Event) => this.handleFormatChange(event, EditorFormat.YAML)}
                ><label for="yaml">YAML</label>
              </div>
            </div>
            <button
              id="submit-button"
              role="button"
              class="button"
              @click=${(event: MouseEvent) => this.handleSubmit(event)}
            >Send (Ctrl+\u21a9)</button>
          </div>
          <div class="editor default-cursor" id="editor-container"></div>
        </section>
        <section id="right-section" class="half resizer-r">
          <slot @slotchange=${this.handleSlotChange}></slot>
        </section>
      </div>
    `
  }
}
