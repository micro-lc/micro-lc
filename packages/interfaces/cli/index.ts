import { readFile } from 'fs/promises'

import { intake } from './intake'
import { parseArgs, exit, resolveFiles, error } from './utils'

export { intake, resolveFiles }

async function run() {
  const { to, files } = parseArgs()

  const paths = resolveFiles(files)

  const intakeFilePromises = paths.map(async path => {
    const buffer = await readFile(path)
    return intake(buffer, path, { to })
  })

  const results = await Promise.allSettled(intakeFilePromises)

  results.forEach(({ status, ...rest }, i) => {
    if (status === 'rejected') {
      error(`on file: ${paths[i]}\n\t=> ${(rest as {reason: string}).reason}`)
    }
  })

  exit()
}

run().catch(err => console.error(err))
