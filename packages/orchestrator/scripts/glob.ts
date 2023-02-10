import { globSync } from 'glob'

export default globSync('src/**/*[^d].{j,t}s?(x)')
  .filter((name) => !name.match(/(stories|test)\.(j|t)sx?$/))
