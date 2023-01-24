import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import banner from 'vite-plugin-banner'

import settings from '../../settings.json'

export default defineConfig(({ mode }) => ({
  base: './',
  build: {
    emptyOutDir: false,
    manifest: true,
    minify: !mode.includes('development'),
    outDir: 'dist',
    rollupOptions: {
      input: {
        'micro-lc': 'src/micro-lc.ts',
      },
      output: {
        assetFileNames: ({ name }) => {
          console.log(name)
          if (name === undefined) {
            return `assets/[hash].[ext]`
          } else if (['401.html', '404.html', '500.html'].includes(name)) {
            return `assets/${name.replace(/\.html$/, '')}.[ext]`
          } else if (name === 'composer.production.js') {
            return `assets/composer.[ext]`
          }

          return `assets/${name}-[hash].[ext]`
        },
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
    target: settings.target,
  },
  plugins: [
    banner(settings.banner.join('\n')),
  ],
  resolve: {
    alias: [
      {
        find: /process\.env\.NODE_ENV/,
        replacement: JSON.stringify(mode),
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
