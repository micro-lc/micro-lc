export default new Promise<void>((resolve) => {
  import('./web-component').then(({ default: Microlc }) => {
    customElements.define('micro-lc', Microlc)
    resolve()
  }).catch(console.error)
})
