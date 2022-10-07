import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'

import target from './scripts/target'

export default defineConfig(({ mode }) => ({
  base: './',
  build: {
    emptyOutDir: false,
    manifest: true,
    minify: !mode.includes('development'),
    outDir: 'dist',
    rollupOptions: {
      external: mode.includes('.') ? ['rxjs'] : [],
      input: {
        'micro-lc': 'src/micro-lc.ts',
      },
      output: {
        entryFileNames: ({ name }) => `${name}.${mode}.js`,
        manualChunks: (id) => {
          if (mode !== 'production' && id.match(/qiankun/)) {
            return 'qiankun'
          }
        },
      },
      plugins: [visualizer()],
    },
  },
  esbuild: {
    format: 'esm',
    target,
  },
  resolve: {
    alias: [
      {
        find: /process\.env\.NODE_ENV/,
        replacement: JSON.stringify(mode.split('.')[0]),
      },
      { find: /^.+\/lodash\/cloneDeep.js/, replacement: require.resolve('lodash-es/cloneDeep.js') },
      { find: /^.+\/lodash\/concat.js/, replacement: require.resolve('lodash-es/concat.js') },
      { find: /^.+\/lodash\/forEach.js/, replacement: require.resolve('lodash-es/forEach.js') },
      { find: /^.+\/lodash\/isFunction.js/, replacement: require.resolve('lodash-es/isFunction.js') },
      { find: /^.+\/lodash\/mergeWith.js/, replacement: require.resolve('lodash-es/mergeWith.js') },
      { find: /^.+\/lodash\/noop.js/, replacement: require.resolve('lodash-es/noop.js') },
      { find: /^.+\/lodash\/once.js/, replacement: require.resolve('lodash-es/once.js') },
      { find: /^.+\/lodash\/snakeCase.js/, replacement: require.resolve('lodash-es/snakeCase.js') },
    ],
  },
}))
