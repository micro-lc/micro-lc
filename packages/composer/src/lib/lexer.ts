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
import type { ErrorCodes } from './logger'
import logger from './logger'

interface Append {
  append: (char: string) => void
  flush: () => void
}

type VariableBuffers = string[] & Append

type LiteralBuffers = [string, ...string[]] & Append

enum LexerMode {
  String,
  PossiblyNormal,
  Normal,
}

interface Context {
  braceCnt: number
  literals: LiteralBuffers
  mode: LexerMode
  variables: VariableBuffers
}

interface LexerResult {
  literals: TemplateStringsArray
  variables: string[]
}

const createBuffer = (): VariableBuffers => {
  const buffer: string[] = []

  return Object.assign(
    buffer,
    {
      append: (char: string) => {
        buffer[buffer.length - 1] += char
      },
      flush: () => {
        buffer.push('')
      },
    }
  )
}

const createLiteralBuffer = (): LiteralBuffers => {
  const buffer: [string, ...string[]] = ['']

  return Object.assign(
    buffer,
    {
      append: (char: string) => {
        buffer[buffer.length - 1] += char
      },
      flush: () => {
        buffer.push('')
      },
    }
  )
}

const createLiteralsTemplate = (li: [string, ...string[]], variables: string[]) => {
  const value: ReadonlyArray<string> & {raw?: string[]} = [...li]

  return {
    literals: Object.defineProperty(value, 'raw', { get: () => value }) as TemplateStringsArray,
    variables: [...variables],
  }
}
const createContext = (): Context => ({
  braceCnt: 0,
  literals: createLiteralBuffer(),
  mode: LexerMode.String,
  variables: createBuffer(),
})

const createLexer = (input: string) => {
  const parse = () => {
    const parsed = Array.from(input).reduce((acc, next) => {
      switch (acc.mode) {
      case LexerMode.Normal: {
        if (next === '}' && acc.braceCnt === 0) {
          acc.mode = LexerMode.String
          break
        }

        if (next === '{') {
          acc.braceCnt += 1
        } else if (next === '}' && acc.braceCnt > 0) {
          acc.braceCnt -= 1
        }

        acc.variables.append(next)
        break
      }
      case LexerMode.PossiblyNormal: {
        acc.literals.append(next)

        if (next === '{') {
          acc.literals.flush()
          acc.variables.flush()
          acc.mode = LexerMode.Normal
        } else {
          acc.mode = LexerMode.String
        }
        break
      }
      case LexerMode.String:
      default: {
        if (next === '$') {
          acc.mode = LexerMode.PossiblyNormal
        }

        acc.literals.append(next)
      }
      }

      return acc
    }, createContext())

    if (parsed.mode === LexerMode.Normal) {
      parsed.literals.pop()
      // SAFETY: it must be present due to the
      // fact it was pushed in when switching to normal mode
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      parsed.literals.append(parsed.variables.pop()!)
    }

    parsed.literals.forEach((value, index, literals) => {
      if (index < literals.length - 1) {
        literals[index] = value.slice(0, -2)
      }
    })

    return parsed
  }

  let done = input.length === 0

  return {
    run: () => {
      let context: Context | undefined

      if (!done) {
        context = parse()
        done = true
      }

      const { literals, variables } = context ?? createContext()

      return createLiteralsTemplate(literals, variables)
    },
  }
}

const digest = async (input: string, algorithm: AlgorithmIdentifier = 'SHA-1') =>
  window.crypto.subtle.digest(
    algorithm,
    new TextEncoder().encode(input)
  )

const cache = new Map<ArrayBuffer, LexerResult>()

const lexer = async (input: string): Promise<LexerResult> => {
  const hash = await digest(input).catch((err: TypeError) => {
    logger.error('40' as ErrorCodes.DigestError, input, err.message)
  })

  if (!hash || !cache.has(hash)) {
    const result = createLexer(input).run()
    hash && cache.set(hash, result)

    return result
  }

  // SAFETY: previous if checked that cache has `hash` entry
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return cache.get(hash)!
}

export type { LexerResult }
export { lexer }
