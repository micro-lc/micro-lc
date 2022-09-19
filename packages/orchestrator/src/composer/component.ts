import { render } from 'lit-html'

export class Composer extends HTMLElement {
  connectedCallback() {
    render(undefined, this)
  }
}
