import { createRequire } from 'module'

import rollupAlias from '@rollup/plugin-alias'
import rollupJson from '@rollup/plugin-json'
import rollupReplace from '@rollup/plugin-replace'
import { esbuildPlugin } from '@web/dev-server-esbuild'
import { fromRollup } from '@web/dev-server-rollup'

const require = createRequire(import.meta.url)

const alias = fromRollup(rollupAlias)
const json = fromRollup(rollupJson)
const replace = fromRollup(rollupReplace)

console.log(`

Did you run \`yarn o postinstall\`?

`)

/** @type {import('@web/dev-server').DevServerConfig} */
export default {
  middleware: [
    function rewriteIndex(ctx, next) {
      const directPaths = /^\/(dist|.dev|src|__|node_modules)/
      if (!ctx.url.match(directPaths)) {
        ctx.url = '/index.html'
      }

      return next()
    },
  ],
  mimeTypes: {
    '**/*.schema.json': 'application/javascript',
  },
  plugins: [
    alias({
      entries: [
        { find: /^.+\/lodash\/cloneDeep.js/, replacement: require.resolve('lodash-es/cloneDeep.js') },
        { find: /^.+\/lodash\/concat.js/, replacement: require.resolve('lodash-es/concat.js') },
        { find: /^.+\/lodash\/forEach.js/, replacement: require.resolve('lodash-es/forEach.js') },
        { find: /^.+\/lodash\/isFunction.js/, replacement: require.resolve('lodash-es/isFunction.js') },
        { find: /^.+\/lodash\/mergeWith.js/, replacement: require.resolve('lodash-es/mergeWith.js') },
        { find: /^.+\/lodash\/noop.js/, replacement: require.resolve('lodash-es/noop.js') },
        { find: /^.+\/lodash\/once.js/, replacement: require.resolve('lodash-es/once.js') },
        { find: /^.+\/lodash\/snakeCase.js/, replacement: require.resolve('lodash-es/snakeCase.js') },
        // custom bundles
        { find: /^.+\/@babel\/runtime\/regenerator\/index.js/, replacement: require.resolve('./node_modules/@babel/runtime/regenerator/index.js') },
        { find: /^.+\/ajv\/dist\/ajv.js/, replacement: require.resolve('./node_modules/ajv/dist/ajv.js') },
        { find: /^.+\/ajv-formats\/dist\/index.js/, replacement: require.resolve('./node_modules/ajv-formats/dist/index.js') },
      ],
    }),
    esbuildPlugin({
      target: 'es2020',
      ts: true,
    }),
    json(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }, { preventAssignment: true }),
  ],
}
