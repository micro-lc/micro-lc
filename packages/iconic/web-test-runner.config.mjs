import rollupReplace from '@rollup/plugin-replace'
import { esbuildPlugin } from '@web/dev-server-esbuild'
import { importMapsPlugin } from '@web/dev-server-import-maps'
import { fromRollup } from '@web/dev-server-rollup'
import { playwrightLauncher } from '@web/test-runner-playwright'

const replace = fromRollup(rollupReplace)

/** @type {import('@web/test-runner').TestRunnerConfig} */
export default {
  coverageConfig: {
    include: ['./src/**/*.ts'],
    report: true,
    reportDir: 'coverage',
    reporters: ['cobertura', 'lcovonly', 'text'],
  },
  groups: [
    {
      browsers: [
        playwrightLauncher({ product: 'chromium' }),
        playwrightLauncher({ product: 'firefox' }),
        playwrightLauncher({ product: 'webkit' }),
      ],
      files: 'test/**/*.test.ts',
      name: 'all',
    },
  ],
  plugins: [
    esbuildPlugin({
      target: 'es2020',
      ts: true,
    }),
    importMapsPlugin({
      inject: {
        importMap: {
          imports: {
            'prop-types': 'https://esm.sh/prop-types@next',
            react: 'https://esm.sh/react@next',
            'react-dom/client': 'https://esm.sh/react-dom@next/client',
          },
        },
      },
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }, { preventAssignment: true }),
  ],
}
