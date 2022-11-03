import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import postcssAntDynamicTheme from '@micro-lc/interfaces/postcss-ant-dynamic-theme'
import cssnano from 'cssnano'
import rollupNodePolyFill from 'rollup-plugin-node-polyfills'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import banner from 'vite-plugin-banner'
import dynamicImport from 'vite-plugin-dynamic-import'

import settings from '../../settings.json'

export default defineConfig(({ mode }) => ({
  base: './',
  build: {
    chunkSizeWarningLimit: 5000,
    dynamicImportVarsOptions: {
      exclude: [
        require.resolve('@micro-lc/iconic/dist/import-icon/index.js'),
      ],
    },
    emptyOutDir: false,
    manifest: true,
    outDir: 'dist',
    rollupOptions: {
      external: mode === 'min' ? ['react', 'react-dom'] : [],
      input: {
        index: 'src/index.ts',
        'mlc-antd-theme-manager': 'src/web-components/mlc-antd-theme-manager/index.ts',
        'mlc-config': 'src/web-components/mlc-config/index.ts',
        'mlc-iconic': 'src/web-components/mlc-iconic/index.ts',
        'mlc-layout': 'src/web-components/mlc-layout/index.ts',
        'mlc-loading-animation': 'src/web-components/mlc-loading-animation/index.ts',
        'mlc-url': 'src/web-components/mlc-url/index.ts',
      },
      output: {
        entryFileNames: ({ name }) => (mode !== 'min' ? `${name}.js` : `${name}.${mode}.js`),
      },
      plugins: [visualizer(), rollupNodePolyFill()],
    },
  },
  css: {
    postcss: {
      plugins: [
        postcssAntDynamicTheme({ antVariableThemeSelector: ':host', outgoingPrefix: 'micro-lc' }),
        cssnano,
      ],
    },
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          'html-selector': ':host',
          'zindex-header': 'var(--micro-lc-zindex-header, 1000)',
        },
      },
    },
  },
  esbuild: {
    target: settings.target,
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
          process: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
  plugins: [
    dynamicImport({
      viteIgnore: (_, id) => {
        const matches = [/iconic\/dist\/import-icon/]
        const checks = matches.reduce((acc, match) => acc || id.match(match) !== null, false)
        return checks ? true : undefined
      },
    }),
    banner(settings.banner.join('\n')),
  ],
  resolve: {
    alias: {
      path: 'rollup-plugin-node-polyfills/polyfills/path',
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    dedupe: ['react', 'react-dom'],
  },
}))
