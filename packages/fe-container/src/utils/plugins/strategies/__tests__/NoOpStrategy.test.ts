import {noOpStrategy} from '@utils/plugins/strategies/NoOpStrategy'

describe('NoOpStrategy', () => {
  it('Execution ok', () => {
    noOpStrategy().handlePluginLoad()
  })
})
