import { exec as childProcessExec } from 'child_process'
import { readFile, writeFile } from 'fs/promises'
import { dirname, resolve as pathResolve } from 'path'
import { fileURLToPath } from 'url'

import { Command } from 'commander'
import logger from 'node-color-log'

logger.setDate(() => '')

const __dirname = dirname(fileURLToPath(import.meta.url))

const packages = [
  'micro-lc',
  'interfaces',
  'iconic',
  'composer',
  'orchestrator',
  'layout',
]

const colorMap = {
  error: 'red',
  stderr: 'yellow',
  stdout: 'green',
}

class PromiseQueue {
  constructor() {
    this.queue = Promise.resolve()
  }

  get() {
    return this.queue
  }

  add(step, operation) {
    this.queue = this.queue
      .then(operation)
      .then(() => {
        logger.bgColor('green').log(`[${step}]`)
          .joint()
          .color('white')
          .log(` ▶ OK\n`)
      }).catch((err) => {
        logger.bgColor('magenta').log(`[${step}]`)
          .joint()
          .color('white')
          .log(` ▶ Failed\n`)
        throw err
      })
    return this.queue
  }
}

const exec = async (step, command) => {
  let innerResolve
  let innerReject
  const promise = new Promise((resolve, reject) => {
    innerResolve = resolve
    innerReject = reject
  })

  const proc = childProcessExec(command, (error, stdout, stderr) => {
    let color
    let message
    if (error) {
      color = colorMap.error
      message = `${error.message}\n\n${error.stack}`
    } else if (stderr) {
      color = colorMap.stderr
      message = stderr
    } else {
      color = colorMap.stdout
      message = stdout
    }

    return logger.bgColor(color).log(`[${step}]`)
      .joint()
      .color('white')
      .log(` ▶ ${message}`)
  })
  proc.on('exit', (code) => {
    code === 0
      ? innerResolve()
      : innerReject()
  })

  return promise
}

function getArgs() {
  const program = new Command()
  const ctx = {}

  program
    .name('bump')
    .description('Command line to handle subpackages version bumps')
    .argument('<package>', `The package to be bumped. Pick one out of the following list: ${packages.join(', ')}`)
    .argument('<version>', `The version to reach. Can be either 'major', 'minor', or 'patch'. Alternatively a specific version can be issued, like '2.1.3-rc2'`)
    .action((pkg, version) => {
      ctx.package = pkg
      ctx.version = version
    })
    .parse()

  return ctx
}

const semverRegex = /^([0-9]+)\.([0-9]+)\.([0-9]+)$/

async function queryVersion(workingDir) {
  return readFile(`${workingDir}/package.json`)
    .then((content) => JSON.parse(content))
    .then(({ version }) => version)
    .catch(() => {
      throw new TypeError(`No package.json file found at ${workingDir}`)
    })
}
async function querySemVer(workingDir) {
  return readFile(`${workingDir}/package.json`)
    .then((content) => JSON.parse(content))
    .then(({ version }) => (version.match(semverRegex) ? version : undefined))
    .catch(() => {
      throw new TypeError(`No package.json file found at ${workingDir}`)
    })
}

async function updateChangelog(workingDir, version) {
  console.log(pathResolve(workingDir, 'CHANGELOG.md'))
  return readFile(pathResolve(workingDir, 'CHANGELOG.md'))
    .then((content) => {
      const lines = content.toString().split(/(?:\r\n|\r|\n)/g)
      const unreleasedLine = lines
        .findIndex((line) =>
          line
            .trim()
            .replace(/\s/g, '')
            .toLowerCase()
            .match(/^##unreleased/)
        )

      const date = new Date().toISOString()
      const tIndex = date.indexOf('T')

      const output = lines
        .slice(0, unreleasedLine + 1)
        .concat('')
        .concat(`## [${version}] - ${date.slice(0, tIndex)}`)
        .concat('')
        .concat(lines.slice(unreleasedLine + 2))
      return writeFile(pathResolve(workingDir, 'CHANGELOG.md'), output.join('\n'))
    })
    .catch((err) => {
      logger.error(err.message)
      return undefined
    })
}

async function main() {
  const ctx = getArgs()

  if (!packages.includes(ctx.package)) {
    throw new TypeError(`first argument <package> must be one of the following: ${packages.join(', ')}`)
  }

  const queue = new PromiseQueue()

  let workingDir = pathResolve(__dirname, '..')
  let tagScope = 'micro-lc'
  let tagPrefix = 'v'
  if (ctx.package !== 'micro-lc') {
    workingDir = pathResolve(__dirname, `../packages/${ctx.package}`)
    tagScope = `@micro-lc/${ctx.package}`
    tagPrefix = `${tagScope}@`
  }

  await queue.add('version', () => exec('version', `(cd ${workingDir} ; yarn version ${ctx.version})`))

  const newSemVersion = await querySemVer(workingDir)
  if (newSemVersion !== undefined) {
    queue.add('update-changelog', () => updateChangelog(workingDir, newSemVersion))
  }

  queue.add('reset-stage', () => exec('reset-stage', 'git reset'))
  queue.add('add-to-stage', () => exec('add-to-stage', `git add ${pathResolve(workingDir, 'package.json')} ${pathResolve(workingDir, 'CHANGELOG.md')} ${pathResolve(__dirname, '..', '.yarn', 'versions')}`))

  const newVersion = await queryVersion(workingDir)
  queue.add('commit', () => exec('commit', `git commit -nm "${tagScope} tagged at version: ${newVersion}"`))

  const tag = `${tagPrefix}${newVersion}`
  queue.add('commit', () => exec('tag', `git tag -a "${tag}" -m "${tagScope} tagged at version: ${newVersion}"`))

  return queue.get().then(() => tag)
}

main()
  .then((tag) => {
    logger.color('green').log('\n\tpush both branch and tag:')
    logger.color('magenta').log(`\n\tgit push && git push origin ${tag}`)
  })
  .catch((err) => {
    console.error(`[error boundary]: ${err}`)
  })
