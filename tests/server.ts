/* eslint-disable no-sync */

import fs from 'fs'
import path from 'path'

import type { Response } from 'express'
import express from 'express'

const port = 3000

const app = express()

const notFound = (res: Response) => {
  res.statusCode = 404
  res.setHeader('Content-Type', 'application/json')
  res.send({ error: 'Not Found', message: 'Not Found', status: 404 })
}

app.use('/playground', express.static('playground'))
app.use('/packages', express.static('packages'))
app.use('/', express.static('tests'))
app.use('/home', (req, res, next) => {
  const { url } = req
  if (fs.existsSync(path.join(__dirname, url))) {
    express.static('tests', { index: true })(req, res, next)
    return
  }

  res.statusCode = 200
  res.setHeader('content-type', 'text/html')
  res.send(fs.readFileSync(path.resolve(__dirname, 'index.html')))
})
app.use('/dev/*', express.static('tests/dev'))
app.use('/pages/*', express.static('tests/pages'))
app.use('/applications/*', express.static('tests/applications'))

app.use('/__reverse/*', (_, res) => {
  try {
    fs.readFile(path.join(__dirname, '/__reverse/index.html'), (error, data) => {
      if (error !== null) {
        return notFound(res)
      }

      res.statusCode = 200
      res.setHeader('content-type', 'text/html')
      res.send(data)
    })
  } catch (error) {
    return notFound(res)
  }
})

app.use('/configurations', (req, res) => {
  const { url } = req
  if (url === '/home.config.json') {
    res.send({
      content: {
        attributes: { id: 'inner-div' },
        content: [
          'Hello',
          {
            attributes: { id: 'paragraph' },
            booleanAttributes: 'hidden',
            properties: { eventBus: 'eventBus.[0]' },
            tag: 'p',
          },
        ],
        tag: 'div',
      },
    })
    return
  }

  res.statusCode = 404
  res.setHeader('Content-Type', 'application/json')
  res.send({ error: 'Not Found', message: `cannot find anything at ${url}`, status: 404 })
})

app.listen(port, () => {
  console.log(`Serving static files on ${port}`)
})
