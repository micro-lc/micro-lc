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
          let prefix = ''
          if (mode !== 'production') {
            prefix = 'dev/'
          }

          if (name === undefined) {
            return `${prefix}assets/[hash].[ext]`
          } else if (['401.html', '404.html', '500.html'].includes(name)) {
            return `assets/${name.replace(/\.html$/, '')}.[ext]`
          } else if (name === 'composer.production.js') {
            return `${prefix}assets/composer.[ext]`
          }

          return `${prefix}assets/${name}-[hash].[ext]`
        },
        chunkFileNames: ({ name }) => {
          let prefix = ''
          if (mode !== 'production') {
            prefix = 'dev/'
          }
          return `${prefix}assets/${name}.js`
        },
        entryFileNames: ({ name }) => `${name}.${mode}.js`,
        manualChunks: (id) => {
          if (id.match(/es-module-shims/)) {
            return 'es-module-shims'
          }

          if (id.match(/js-yaml/)) {
            return 'js-yaml'
          }

          return 'micro-lc'
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
  server: {
    port: 5173,
    proxy: {
      '/src/error-lifecycle.js': {
        rewrite(path) {
          return path.replace('/src', '')
        },
        target: 'http://localhost:5173',
      },
      '/src/error-style.css': {
        rewrite(path) {
          return path.replace('/src', '')
        },
        target: 'http://localhost:5173',
      },
    },
  },
}))
