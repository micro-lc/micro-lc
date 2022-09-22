export {}

class BkCrudClient extends HTMLElement {
  microlcApi

  connectedCallback() {
    console.log(this.microlcApi)
  }
}

customElements.define('bk-crud-client', BkCrudClient)