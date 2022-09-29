import { esbuildPlugin } from '@web/dev-server-esbuild'

/** @type {import('@web/dev-server').DevServerConfig} */
export default {
  injectWebSocket: false,
  middleware: [
    function rewriteIndex(ctx, next) {
      const directPaths = /\/(dist|.dev|src|__|node_modules|back-kit)/
      if (!ctx.url.match(directPaths)) {
        ctx.url = '/index.html'
      } else if (ctx.url.match(/\/[45]\d{2}.html/)) {
        ctx.url = `/packages/orchestrator/mocks/4xx.html`
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
