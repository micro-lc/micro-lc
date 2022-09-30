import rollupReplace from '@rollup/plugin-replace'
import { esbuildPlugin } from '@web/dev-server-esbuild'
import { fromRollup } from '@web/dev-server-rollup'
import { playwrightLauncher } from '@web/test-runner-playwright'

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
  ],
  plugins: [
    esbuildPlugin({
      target: 'es2020',
      ts: true,
    }),
    replace({ 'process.env.NODE_ENV': JSON.stringify('development') }, { preventAssignment: true }),
  ],
}
