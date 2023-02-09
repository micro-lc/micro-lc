const rollupNodePolyFill = require('rollup-plugin-node-polyfills')
const {mergeConfig} = require('vite')
const {default: tsconfigPaths} = require('vite-tsconfig-paths')
const {default: dynamicImport} = require('vite-plugin-dynamic-import')
const {replaceCodePlugin} = require('vite-plugin-replace')
const {default: postcssAntDynamicTheme} = require('@micro-lc/interfaces/postcss-ant-dynamic-theme')

/** @type {import('@storybook/core-common').StorybookConfig} */
module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  framework: '@storybook/web-components',
  core: { builder: '@storybook/builder-vite', disableTelemetry: true },
  staticDirs: ['./static'],
  viteFinal: (config) => mergeConfig(config, {
      plugins: [
        tsconfigPaths(),
        dynamicImport({
          viteIgnore: (_, id) => {
            const matches = [/iconic\/dist\/import-icon/]
            const checks = matches.reduce((acc, match) => acc || id.match(match) !== null, false)
            return checks ? true : undefined
          }
        }),
        replaceCodePlugin({
          replacements: [
            {
              from: './lang',
              to: './../../../../lang'
            },
          ]
        }),
      ],
      css: {
        preprocessorOptions: {
          less: {
            javascriptEnabled: true,
            modifyVars: {
              'html-selector': ':host',
              'zindex-header': 'var(--micro-lc-zindex-header, 1000)'
            }
          }
        },
        postcss: {
          plugins: [
            postcssAntDynamicTheme({ outgoingPrefix: 'micro-lc', antVariableThemeSelector: ':host' })
          ]
        }
      },
      esbuild: {target: 'ES2020'},
      optimizeDeps: {
        needsInterop: [
          'monaco-editor/esm/vs/editor/contrib/documentSymbols/browser/documentSymbols.js',
          'monaco-editor/esm/vs/editor/contrib/format/browser/formatActions.js',
          'monaco-editor/esm/vs/editor/contrib/inPlaceReplace/browser/inPlaceReplace.js',
          'monaco-editor/esm/vs/editor/contrib/stickyScroll/browser/stickyScroll.js',
          'monaco-editor/esm/vs/editor/contrib/viewportSemanticTokens/browser/viewportSemanticTokens.js',
          'monaco-editor/esm/vs/editor/standalone/browser/accessibilityHelp/accessibilityHelp.js',
          'monaco-editor/esm/vs/editor/standalone/browser/inspectTokens/inspectTokens.js',
        ],
      },
      build: {
        dynamicImportVarsOptions: {
          exclude: [
            require.resolve('@micro-lc/iconic/dist/import-icon/index.js'),
          ]
        },
        rollupOptions: {
          plugins: [rollupNodePolyFill()]
        },
        chunkSizeWarningLimit: 4000
      },
      resolve: {
        alias: {
          './worker': require.resolve('./worker.js'),
          path: 'rollup-plugin-node-polyfills/polyfills/path',
          'process.env.NODE_ENV': JSON.stringify('development'),
        },
        dedupe: [
          '@storybook/client-api',
          'react',
          'react-dom',
          'monaco-editor',
        ]
      },
      server: {
        proxy: {
          '/dist/fas': 'http://localhost:8000/'
        }
      }
    })
}
