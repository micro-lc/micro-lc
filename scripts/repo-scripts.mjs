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

const exec = async (step, command, callback) => {
  let innerResolve
  let innerReject
  const promise = new Promise((resolve, reject) => {
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

    return callback
      ? callback(error, stdout, stderr)
      : logger.bgColor(color).log(`[${step}]`)
        .joint()
        .color('white')
        .log(` ▶ ${message}`)
  })
  proc.on('spawn', () => logger.color('cyan').bold().underscore()
    .log(`\t\t${step}  ${icons[step]} \n`))
  proc.on('exit', (code) => {
    code === 0
      ? innerResolve()
      : innerReject()
  })

  return promise
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

const listOfCommands = (routine, subargv) => {
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
  } else {
    throw new TypeError(`${routine} does not exist`)
  }

  if (until && !runningSteps.includes(until)) {
    throw new TypeError(`First argument must be a valid intialize step: ${runningSteps.join(', ')}`)
  } else if (until === undefined) {
    until = runningSteps[runningSteps.length - 1]
  }

  const lastStep = runningSteps.indexOf(until)
  return runningSteps.slice(0, lastStep + 1)
}

async function main(routine, subargv) {
  logger.log('\n')
  const queue = new PromiseQueue()
  const runningSteps = listOfCommands(routine, subargv)
  runningSteps.forEach((step) => {
    queue.add(step, () => exec(step, commands[routine][step]))
  })

  await queue.get()
}

const argv = process.argv.slice(2)
const [routine, ...subargv] = argv

const routines = ['initialize', 'coverage']
if (!routines.includes(routine)) {
  console.error(`${routine} is not valid. Must be one of ${routines.join(', ')}.`)
}

main(routine, subargv).catch((err) => {
  console.error(`[error boundary]: ${err}`)
})
