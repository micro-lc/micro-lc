import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import postcssAntDynamicTheme from '@micro-lc/interfaces/postcss-ant-dynamic-theme'
import cssnano from 'cssnano'
import rollupNodePolyFill from 'rollup-plugin-node-polyfills'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import banner from 'vite-plugin-banner'
import dynamicImport from 'vite-plugin-dynamic-import'

import settings from '../../settings.json' assert {type: 'json'}

const input = (mode: string): Record<string, string> => {
  const minInput = {
    'mlc-antd-theme-manager': 'src/web-components/mlc-antd-theme-manager/index.ts',
    'mlc-layout': 'src/web-components/mlc-layout/index.ts',
    'mlc-loading-animation': 'src/web-components/mlc-loading-animation/index.ts',
  }
  if (mode !== 'min') {
    return {
      ...minInput,
      'mlc-iconic': 'src/web-components/mlc-iconic/index.ts',
      'mlc-url': 'src/web-components/mlc-url/index.ts',
    }
  }
  return minInput
}

// @ts-expect-error supported
export default defineConfig(({ mode }) => {
  return {
    base: './',
    build: {
      chunkSizeWarningLimit: 3000,
      dynamicImportVarsOptions: {
        exclude: [
          '@micro-lc/iconic/dist/import-icon/index.js',
        ],
      },
      emptyOutDir: false,
      manifest: `manifest${mode === 'min' ? '.min' : ''}.json`,
      outDir: 'dist',
      rollupOptions: {
        external: mode === 'min' ? ['react', 'react-dom'] : [],
        input: input(mode),
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
        filter(id) {
          const matches = [/iconic\/dist\/import-icon/]
          return !matches.reduce((acc, match) => acc || id.match(match) !== null, false)
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
  }
})
