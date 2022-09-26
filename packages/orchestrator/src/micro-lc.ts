export default new Promise<void>((resolve) => {
  import('./apis').then(({ default: Microlc }) => {
    customElements.define('micro-lc', Microlc)
    resolve()
  }).catch(console.error)
})
