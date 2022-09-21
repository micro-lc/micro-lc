export default new Promise<void>((resolve) => {
  import('./micro-lc').then(({ default: MicroLC }) => {
    customElements.define('micro-lc', MicroLC)
    resolve()
  }).catch(console.error)
})
