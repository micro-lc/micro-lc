/**
  Copyright 2022 Mia srl

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
import { resolve as nodeResolve } from 'path'

import { Command } from 'commander'
import glob from 'glob'

import { modes, supportedVersions } from './intake'
import type { Context, Version } from './intake'

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
  case 'from':
  case 'to': {
    if (!supportedVersions.includes(value as Version)) {
      exit(1, `${value as string} is not a supported version to target. Supported versions are ${supportedVersions.join(', ')}`)
      return
    }

    this[key] = value as Version
    break
  }
  default: break
  }
}

export function parseArgs(version: string): Context {
  const program = new Command()

  // TODO: take from package.json
  program
    .name('cli')
    .description('micro-lc configuration migration tool')
    .version(version)

  program
    .option('-f, --from <version>', `input files configuration version (${supportedVersions.join(', ')})`, '1')
    .option('-t, --to <version>', `configuration version to target (${supportedVersions.join(', ')})`, '2')
    .option('-m, --mode <mode>', `translation mode, choose between ${modes.join(', ')}`, 'config')
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
