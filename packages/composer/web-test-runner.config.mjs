import rollupReplace from '@rollup/plugin-replace'
import { esbuildPlugin } from '@web/dev-server-esbuild'
import { fromRollup } from '@web/dev-server-rollup'

import settings from '../../settings.json' assert {type: 'json'}

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
      target: settings.target,
      ts: true,
    }),
    replace({
      'import.meta.env.MODE': JSON.stringify('development'),
    }, { preventAssignment: true }),
  ],
}
