/* eslint-disable max-statements */
import { exec as childProcessExec } from 'child_process'
import { readFile, writeFile } from 'fs/promises'
import { dirname, resolve as pathResolve } from 'path'
import { fileURLToPath } from 'url'

import { Command } from 'commander'
import logger from 'node-color-log'

interface Context {
  package: string
  version: string
}

logger.setDate(() => '')

const __dirname = dirname(fileURLToPath(import.meta.url))

const packages = [
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
  queue: Promise<unknown>

  constructor() {
    this.queue = Promise.resolve()
  }

  get() {
    return this.queue
  }

  add(step: string, operation: () => Promise<unknown>) {
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

const exec = async (step: string, command: string) => {
  let innerResolve: () => void
  let innerReject: (reason?: unknown) => void
  const promise = new Promise<void>((resolve, reject) => {
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

    // @ts-expect-error cannot import `types.COLOR`
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

function getArgs(): Context {
  const program = new Command()
  const ctx: Partial<Context> = {}

  program
    .name('bump')
    .description('Command line to handle subpackages version bumps')
    .argument('<package>', `The package to be bumped. Pick one out of the following list: ${packages.join(', ')}`)
    .argument('<version>', `The version to reach. Can be either 'major', 'minor', or 'patch'. Alternatively a specific version can be issued, like '2.1.3-rc2'`)
    .action((pkg, version) => {
      ctx.package = String(pkg)
      ctx.version = String(version)
    })
    .parse()

  return ctx as Context
}

const semverRegex = /^([0-9]+)\.([0-9]+)\.([0-9]+)$/

async function queryVersion(workingDir: string) {
  return readFile(`${workingDir}/package.json`, { encoding: 'utf8' })
    .then((content) => JSON.parse(content) as Context)
    .then(({ version }) => version)
    .catch(() => {
      throw new TypeError(`No package.json file found at ${workingDir}`)
    })
}
async function querySemVer(workingDir: string) {
  return readFile(`${workingDir}/package.json`, { encoding: 'utf8' })
    .then((content) => JSON.parse(content) as Context)
    .then(({ version }) => (version.match(semverRegex) ? version : undefined))
    .catch(() => {
      throw new TypeError(`No package.json file found at ${workingDir}`)
    })
}

async function updateChangelog(workingDir: string, version: string) {
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
    .catch((err: Error) => {
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

  const workingDir = pathResolve(__dirname, `../packages/${ctx.package}`)
  const tagScope = `@micro-lc/${ctx.package}`
  const tagPrefix = `${tagScope}@`

  await queue.add('version', () => exec('version', `(cd ${workingDir} ; yarn version ${ctx.version})`))

  const newSemVersion = await querySemVer(workingDir)
  if (newSemVersion !== undefined) {
    await queue.add('update-changelog', () => updateChangelog(workingDir, newSemVersion))
  }

  await queue.add('reset-stage', () => exec('reset-stage', 'git reset'))
  await queue.add('add-to-stage', () => exec('add-to-stage', `git add ${pathResolve(workingDir, 'package.json')} ${pathResolve(workingDir, 'CHANGELOG.md')} ${pathResolve(__dirname, '..', '.yarn/versions')}`))

  if (ctx.package === 'orchestrator') {
    const packageWorkingDir = pathResolve(__dirname, '..')
    await queue.add('version', () => exec('version', `yarn version ${ctx.version}`))
    const packageNewSemVersion = await querySemVer(packageWorkingDir)
    if (packageNewSemVersion !== undefined) {
      await queue.add('copy-changelog', async () => {
        const buffer = await readFile(pathResolve(packageWorkingDir, 'packages/orchestrator/CHANGELOG.md'))
        const content = buffer.toString().replace(
          '# CHANGELOG\n',
          '# CHANGELOG\n'
            + '\n'
            + '👉 This file is a copy of the micro-lc orchestrator [CHANGELOG](./packages/orchestrator/CHANGELOG.md)\n'
        )
        return writeFile(pathResolve(packageWorkingDir, 'CHANGELOG.md'), content)
      })
    }

    await queue.add('add-to-stage', () => exec('add-to-stage', `git add ${pathResolve(packageWorkingDir, 'package.json')} ${pathResolve(packageWorkingDir, 'CHANGELOG.md')} ${pathResolve(packageWorkingDir, '.yarn/versions')}`))
  }

  const newVersion = await queryVersion(workingDir)
  await queue.add('commit', () => exec('commit', `git commit -nm "${tagScope} tagged at version: ${newVersion}"`))

  const tags: string[] = []
  const tag = `${tagPrefix}${newVersion}`
  await queue.add('commit', () => exec('tag', `git tag -a "${tag}" -m "${tagScope} tagged at version: ${newVersion}"`))

  tags.push(tag)
  if (ctx.package === 'orchestrator') {
    const packageTag = `v${newVersion}`
    await queue.add('commit', () => exec('tag', `git tag -a "${packageTag}" -m "micro-lc tagged at version: ${newVersion}"`))
    tags.push(packageTag)
  }

  return queue.get().then(() => tags)
}

main()
  .then((tags) => {
    logger.color('green').log('\n\tpush both branch and tag:')

    const tagString = tags.map((tag) => `git push origin ${tag}`)
    logger.color('magenta').log(`\n\tgit push && ${tagString.join(' && ')}`)
  })
  .catch((err) => {
    console.error(`[error boundary]: ${err}`)
  })
