export default new Promise<void>((resolve) => {
  import('./apis').then(({ default: MicroLC }) => {
    customElements.define('micro-lc', MicroLC)
    resolve()
  }).catch(console.error)
})
