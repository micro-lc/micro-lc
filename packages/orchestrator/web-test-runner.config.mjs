import { createRequire } from 'module'

import rollupAlias from '@rollup/plugin-alias'
import rollupJson from '@rollup/plugin-json'
import rollupReplace from '@rollup/plugin-replace'
import { esbuildPlugin } from '@web/dev-server-esbuild'
import { fromRollup } from '@web/dev-server-rollup'
import { playwrightLauncher } from '@web/test-runner-playwright'

const require = createRequire(import.meta.url)

const alias = fromRollup(rollupAlias)
const json = fromRollup(rollupJson)
const replace = fromRollup(rollupReplace)

/** @type {import('@web/test-runner').TestRunnerConfig} */
export default {
  coverageConfig: {
    include: ['./src/**/*.ts'],
    report: true,
    reportDir: 'coverage/browser',
    reporters: ['cobertura', 'lcovonly', 'text'],
  },
  groups: [
    {
      browsers: [
        playwrightLauncher({ product: 'chromium' }),
        playwrightLauncher({ product: 'firefox' }),
        playwrightLauncher({ product: 'webkit' }),
      ],
      files: 'test/all/**/*.test.ts',
      name: 'browser',
    },
    {
      browsers: [
        playwrightLauncher({ product: 'chromium' }),
        playwrightLauncher({ product: 'firefox' }),
      ],
      files: 'test/chromium-firefox/**/*.test.ts',
      name: 'chromium-firefox',
    },
  ],
  injectWebSocket: false,
  middleware: [
    function rewriteIndex(ctx, next) {
      if (ctx.url === '/composer.test.js') {
        ctx.url = `/mocks${ctx.url}`
      } else if (ctx.url.match(/\/[45]\d{2}.html/)) {
        ctx.url = `/mocks/4xx.html`
      } else {
        const directPaths = /^\/(\?wtr|dist|.dev|src|__|node_modules|wds|test)/
        if (!ctx.url.match(directPaths)) {
          ctx.url = '/'
        }
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
        { find: /^.+\/lodash\/without.js/, replacement: require.resolve('lodash-es/without.js') },
        // custom bundles
        { find: /^.+\/@babel\/runtime\/regenerator\/index.js/, replacement: require.resolve('./node_modules/@babel/runtime/regenerator/index.js') },
        { find: /^.+\/ajv\/dist\/ajv.js/, replacement: require.resolve('./node_modules/ajv/dist/ajv.js') },
        { find: /^.+\/ajv-formats\/dist\/index.js/, replacement: require.resolve('./node_modules/ajv-formats/dist/index.js') },
        { find: /^.+\/chai-string\/chai-string.js/, replacement: require.resolve('./node_modules/chai-string/chai-string.js') },
      ],
    }),
    esbuildPlugin({
      target: 'es2020',
      ts: true,
    }),
    json(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('test'),
    }, { preventAssignment: true }),
  ],
}
