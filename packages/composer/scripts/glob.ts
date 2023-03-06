import { globSync } from 'glob'

export default globSync('src/lib/**/*[^d].{j,t}s?(x)')
  .filter((name) => !name.match(/(stories|test)\.(j|t)sx?$/))
