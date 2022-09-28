import { createRequire } from 'module'

import rollupAlias from '@rollup/plugin-alias'
import rollupReplace from '@rollup/plugin-replace'
import { esbuildPlugin } from '@web/dev-server-esbuild'
import { importMapsPlugin } from '@web/dev-server-import-maps'
import { fromRollup } from '@web/dev-server-rollup'

const require = createRequire(import.meta.url)

const alias = fromRollup(rollupAlias)
const replace = fromRollup(rollupReplace)

/** @type {import('@web/dev-server').DevServerConfig} */
export default {
  plugins: [
    alias({
      entries: [
        {
          find: /^.+\/prop-types\/index\.js/,
          replacement: require.resolve('./node_modules/prop-types/index.js'),
        },
      ],
    }),
    esbuildPlugin({
      ts: true,
    }),
    importMapsPlugin(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }, { preventAssignment: true }),
  ],
}
