import rollupReplace from '@rollup/plugin-replace'
import { esbuildPlugin } from '@web/dev-server-esbuild'
import { fromRollup } from '@web/dev-server-rollup'

const replace = fromRollup(rollupReplace)

/** @type {import('@web/test-runner').TestRunnerConfig} */
export default {
  coverageConfig: {
    include: ['./src/**/*.ts'],
    report: true,
    reportDir: 'coverage/browser',
    reporters: ['cobertura', 'lcovonly', 'text'],
  },
  plugins: [
    esbuildPlugin({
      target: 'es2020',
      ts: true,
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }, { preventAssignment: true }),
  ],
}
