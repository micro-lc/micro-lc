import { resolve as nodeResolve } from 'path'

import { Command } from 'commander'
import glob from 'glob'

import { supportedVersions } from './intake'
import type { Context, Version } from './types'

interface CliOptions {
  quiet?: boolean
  to: Version
}

const context: Context = {
  console: true,
  files: [],
}

export const error = (msg: string) => context.console && console.error(`\x1b[31m[ERROR]: ${msg}\x1b[0m`)
export const info = (msg: string) => context.console && console.info(`\x1b[32m[INFO]: ${msg}\x1b[0m`)

export const exit = (code?: number, msg = 'Bye!') => {
  code !== undefined && code > 0 ? error(msg) : info(msg)

  process.exitCode = code
  process.kill(process.pid, 'SIGTERM')
}

function saveArgsInContext(this: Context, [key, value]: [string, unknown]) {
  switch (key) {
  case 'to': {
    if (!supportedVersions.includes(value as Version)) {
      exit(1, `${value as string} is not a supported version to target. Supported versions are ${supportedVersions.join(', ')}`)
      return
    }

    this.to = value as Version
    break
  }
  default: break
  }
}

export function parseArgs(): Context {
  const program = new Command()

  // TODO: take from package.json
  program
    .name('cli')
    .description('micro-lc configuration migration tool')
    .version('0.1.0')

  program
    .option('-t, --to <version>', `configuration version to target (${supportedVersions.join(', ')})`, 'v2')
    .option('-q, --quiet', 'no output on stdout')
    .argument('<files>', 'file or files glob to be transformed')
    .action((files: string, opts: CliOptions) => {
      const { quiet, ...rest } = opts

      if (quiet) { context.console = false }

      Object
        .entries(rest)
        .forEach(saveArgsInContext, context)

      context.files = glob.sync(files)
      if (context.files.length === 0) { exit(1, `no file matches ${files}`) }
    })

  program.parse()

  return context
}

export const resolveFiles = (paths: string[], resolve = nodeResolve): string[] => paths.map((path) => resolve(path))

export const toArray = <T>(input: T | T[]): T[] => (Array.isArray(input) ? input : [input])
