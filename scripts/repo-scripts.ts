import { exec as childProcessExec } from 'child_process'

import logger from 'node-color-log'

logger.setDate(() => '')

const colorMap = {
  error: 'red',
  stderr: 'yellow',
  stdout: 'green',
}

const steps = {
  coverage: [
    'prepare-test',
    'interfaces',
    'iconic',
    'composer',
    'orchestrator',
    'layout',
  ],
  initialize: [
    'cleanup',
    'interfaces',
    'iconic',
    'composer',
    'orchestrator',
    'layout',
  ],
}

const icons = {
  cleanup: '🗑️',
  composer: '🎂',
  iconic: '🖼️',
  interfaces: '🎱',
  layout: '✨',
  orchestrator: '🎺',
  'prepare-test': '🦩',
}

const commands = {
  coverage: {
    composer: 'yarn m coverage',
    iconic: 'yarn c coverage',
    interfaces: 'yarn i coverage',
    layout: 'yarn l coverage',
    orchestrator: 'yarn o coverage',
    'prepare-test': 'yarn prepare-test',
  },
  initialize: {
    cleanup: 'yarn cleanup',
    composer: 'yarn m build',
    iconic: 'yarn c build',
    interfaces: 'yarn i build',
    layout: 'yarn l build',
    orchestrator: 'yarn o build',
  },
}

const exec = async (step: string, command: string, callback?: (error: unknown, stdout: string, stderr: string) => void) => {
  let innerResolve: () => void
  let innerReject: (reason?: unknown) => void
  const promise = new Promise<void>((resolve, reject) => {
    innerResolve = resolve
    innerReject = reject
  })

  const proc = childProcessExec(command, (error, stdout, stderr) => {
    if (callback) {
      return callback(error, stdout, stderr)
    }

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
  proc.on('spawn', () => logger.color('cyan').bold().underscore()
    .log(`\t\t${step}  ${icons[step as keyof typeof icons]} \n`))
  proc.on('exit', (code) => {
    code === 0
      ? innerResolve()
      : innerReject()
  })

  return promise
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

const listOfCommands = (routine: keyof typeof steps, subargv: string[]) => {
  let runningSteps = steps[routine]
  let [until] = subargv
  const [, next] = subargv

  if (routine === 'initialize') {
    let cleanup = false

    if (until === '-c' || until === '--cleanup') {
      cleanup = true
      until = next
    }

    runningSteps = cleanup ? runningSteps : runningSteps.slice(1)
  } else if (routine === 'coverage') {
    /* noop */
  }

  if (until && !runningSteps.includes(until)) {
    throw new TypeError(`First argument must be a valid intialize step: ${runningSteps.join(', ')}`)
  } else if (until === undefined) {
    until = runningSteps[runningSteps.length - 1]
  }

  const lastStep = runningSteps.indexOf(until)
  return runningSteps.slice(0, lastStep + 1)
}

async function main(routine: keyof typeof steps, subargv: string[]) {
  logger.log('\n')
  const queue = new PromiseQueue()
  const runningSteps = listOfCommands(routine, subargv)
  runningSteps.forEach((step) => {
    queue.add(step, () => exec(step, (commands[routine] as Record<string, string>)[step])).catch((err) => Promise.reject(err))
  })

  await queue.get()
}

const argv = process.argv.slice(2)
const [routine, ...subargv] = argv

const routines = ['initialize', 'coverage']

const isRoutine = (arg: string): arg is keyof typeof steps => routine.includes(arg)

if (!isRoutine(routine)) {
  console.error(`${routine} is not valid. Must be one of ${routines.join(', ')}.`)
}

main(routine as keyof typeof steps, subargv).catch((err) => {
  console.error(`[error boundary]: ${err}`)
})
