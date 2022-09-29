import { esbuildPlugin } from '@web/dev-server-esbuild'

/** @type {import('@web/dev-server').DevServerConfig} */
export default {
  injectWebSocket: false,
  middleware: [
    function rewriteIndex(ctx, next) {
      const directPaths = /\/(packages|dist|.dev|src|__|node_modules|back-kit)/
      const match = ctx.url.match(/\/([45]\d{2}).html$/)?.[1]
      if (match) {
        ctx.url = `/packages/orchestrator/public/${match}.html`
      } else if (ctx.url === '/userinfo') {
        ctx.url = '/.dev/userinfo.json'
      } else if (!ctx.url.match(directPaths)) {
        ctx.url = '/index.html'
      }

      return next()
    },
  ],
  plugins: [
    esbuildPlugin({
      ts: true,
    }),
  ],
}
