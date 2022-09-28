import glob from 'glob'

export default glob
  .sync('src/**/*[^d].{j,t}s?(x)')
  .filter((name) => !name.match(/(stories|test)\.(j|t)sx?$/))
