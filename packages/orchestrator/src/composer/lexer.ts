/* eslint-disable max-statements */
import type { ErrorCodes } from '../logger'
import logger from '../logger'

enum LexerMode {
  String,
  Normal,
  PossiblyNormal
}

export interface LexerResult {
  literals: TemplateStringsArray
  variables: string[]
}

class Lexer {
  private _i = 0
  private _s: string
  private _l: number

  private _d = false
  private _m = LexerMode.String
  private _st: string[] = []
  private _n = 0
  private _li: string[] = []
  private _v: string[] = []

  constructor(input: string) {
    this._s = input
    this._l = input.length

    if (input.length === 0) {
      this._d = true
    }
  }

  private _sw(mode: LexerMode) {
    this._m = mode
  }

  private _fst() {
    this._st = []
  }

  private _fn() {
    this._v.push(this._st.join(''))
    this._fst()
  }

  private _fs() {
    this._li.push(this._st.join(''))
    this._fst()
  }

  private _fpn() {
    this._li.push(this._st.slice(0, -1).join(''))
    this._fst()
  }

  private _nx(): void {
    const current = this._s.charAt(this._i)

    switch (this._m) {
    case LexerMode.Normal: {
      if (current === '{') {
        this._n += 1
        this._st.push(current)
      } else if (current === '}' && this._n === 0) {
        this._fn()
        this._sw(LexerMode.String)
      } else if (current === '}' && this._n > 0) {
        this._st.push(current)
        this._n -= 1
      } else {
        this._st.push(current)
      }
      break
    }
    case LexerMode.PossiblyNormal: {
      if (current === '{') {
        this._fpn()
        this._sw(LexerMode.Normal)
      } else {
        this._sw(LexerMode.String)
        this._st.push(current)
      }

      break
    }
    case LexerMode.String:
    default: {
      if (current === '$') {
        this._sw(LexerMode.PossiblyNormal)
      }

      this._st.push(current)
      break
    }
    }

    this._i += 1
    if (this._i === this._l) {
      if (this._m === LexerMode.PossiblyNormal) {
        this._sw(LexerMode.String)
      } else if (this._m === LexerMode.Normal) {
        throw new TypeError('41' as ErrorCodes.LexerAnalysisEndedInNormalMode, { cause: `${this._i}` })
      }

      this._fs()
      this._d = true
    }
  }

  private _c(): LexerResult {
    const rawLiterals = [...this._li]
    const literals = Object.assign([], rawLiterals)
    Object.defineProperty(literals, 'raw', { value: rawLiterals, writable: false })
    return {
      literals: literals as unknown as TemplateStringsArray,
      variables: this._v,
    }
  }

  run(): LexerResult {
    while (!this._d) {
      this._nx()
    }

    return this._c()
  }
}

const digest = async (input: string, algorithm: AlgorithmIdentifier = 'SHA-1') =>
  window.crypto.subtle.digest(
    algorithm,
    new TextEncoder().encode(input)
  )

const cache = new Map<ArrayBuffer, LexerResult>()

export async function lexer(input: string): Promise<LexerResult> {
  const hash = await digest(input).catch((err: TypeError) => {
    logger.error('40' as ErrorCodes.DigestError, input, err.message)
  })

  if (!hash || !cache.has(hash)) {
    let result: LexerResult

    try {
      result = new Lexer(input).run()
      hash && cache.set(hash, result)
    } catch (err: TypeError | unknown) {
      if (err instanceof TypeError) {
        logger.error(err.message, input, err.cause as string)
      }

      const literals: string[] = []
      Object.defineProperty(literals, 'raw', { value: literals, writable: false })
      result = { literals: literals as unknown as TemplateStringsArray, variables: [] }
    }

    return result
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return cache.get(hash)!
}
