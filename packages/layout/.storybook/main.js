const rollupNodePolyFill = require('rollup-plugin-node-polyfills')
const {mergeConfig} = require('vite')
const {default: tsconfigPaths} = require('vite-tsconfig-paths')
const {default: dynamicImport} = require('vite-plugin-dynamic-import')
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
      build: {
        dynamicImportVarsOptions: {
          exclude: [
            require.resolve('@micro-lc/iconic/dist/import-icon.js'),
          ]
        },
        rollupOptions: {
          plugins: [rollupNodePolyFill()]
        },
        chunkSizeWarningLimit: 4000
      },
      resolve: {
        alias: {
          path: 'rollup-plugin-node-polyfills/polyfills/path'
        },
        dedupe: [
          '@storybook/client-api',
          'react',
          'react-dom',
        ]
      },
      server: {
        proxy: {
          '/dist/fas': 'http://localhost:8000/'
        }
      }
    })
}
