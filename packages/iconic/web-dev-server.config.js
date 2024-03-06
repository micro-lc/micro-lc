import rollupReplace from '@rollup/plugin-replace'
import { esbuildPlugin } from '@web/dev-server-esbuild'
import { importMapsPlugin } from '@web/dev-server-import-maps'
import { fromRollup } from '@web/dev-server-rollup'

const replace = fromRollup(rollupReplace)

/** @type {import('@web/dev-server').DevServerConfig} */
export default {
  plugins: [
    esbuildPlugin({
      target: 'auto', ts: true,
    }),
    importMapsPlugin(),
    replace({
      preventAssignment: true,
      values: { 'process.env.NODE_ENV': JSON.stringify('development') },
    }),
  ],
}
