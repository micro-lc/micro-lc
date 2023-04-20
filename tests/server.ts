/* eslint-disable no-sync */
import fs from 'fs'
import path from 'path'

import express from 'express'

const port = 3000

const app = express()

app.use('/playground', express.static('playground'))
app.use('/packages', express.static('packages'))
app.use('/', express.static('tests'))
app.use('/dev/*', express.static('tests/dev'))
app.use('/pages/*', express.static('tests/pages'))
app.use('/applications/*', express.static('tests/applications'))

app.use('/__reverse/*', (req, res, next) => {
  console.log(req.url)
  const { url } = req
  const baseIndex = '/__reverse/index.html'
  const upperIndex = url.endsWith('/') ? path.join(url, 'index.html') : url.replace(/\/([^/]+)$/, '/index.html')
  const entry = fs.lstatSync(path.join(__dirname, url), { throwIfNoEntry: false })
  if (entry) {
    req.url = upperIndex
    express.static('/__reverse')(req, res, next)
    return
  }

  const upperIndexEntry = fs.lstatSync(path.join(__dirname, upperIndex), { throwIfNoEntry: false })
  if (upperIndexEntry) {
    req.url = upperIndex
    express.static('/__reverse')(req, res, next)
    return
  }

  const baseIndexEntry = fs.lstatSync(path.join(__dirname, baseIndex), { throwIfNoEntry: false })
  if (baseIndexEntry) {
    console.log('base')
    req.url = baseIndex
    express.static('/__reverse')(req, res, next)
    return
  }

  res.statusCode = 404
  res.setHeader('Content-Type', 'application/json')
  res.send({ error: 'Not Found', message: `cannot find anything at ${url}`, status: 404 })
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
