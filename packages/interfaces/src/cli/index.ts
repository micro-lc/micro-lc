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
import { readFile } from 'fs/promises'

import { intake } from './intake'
import { parseArgs, exit, resolveFiles, error } from './utils'

export { intake, resolveFiles }

async function run() {
  const { files, to = 'v2', from = 'v1', mode = 'config' } = parseArgs('0.3.0')

  const paths = resolveFiles(files)

  const intakeFilePromises = paths.map(async path => {
    const buffer = await readFile(path)
    return intake(buffer, path, { from, mode, to })
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
