import { readFile } from 'fs/promises'

import { Command } from 'commander'

function getArgs() {
  const program = new Command()
  const ctx: {dep?: string} = {}

  program
    .name('dep-version')
    .description('Returns `package.json` dependency currently installed version')
    .argument('<dep>', `dependency name`)
    .action((dep) => {
      typeof dep === 'string' && (ctx.dep = dep)
    })
    .parse()

  return ctx
}

async function main(): Promise<string> {
  const { dep: packageName } = getArgs()

  if (packageName === undefined) {
    throw new TypeError('must select a dependency')
  }

  const pathToPackageJSON = require.resolve(`${packageName}/package.json`)
  const buffer = await readFile(pathToPackageJSON)
  const { version } = JSON.parse(buffer.toString()) as {version: string}
  return version
}

main()
  .then(console.log)
  .catch(console.error)
