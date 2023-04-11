import express from 'express'

const port = 3000

const app = express()

app.use('/playground', express.static('playground'))
app.use('/packages', express.static('packages'))
app.use('/', express.static('tests'))
app.use('/dev/*', express.static('tests/dev'))
app.use('/pages/*', express.static('tests/pages'))
app.use('/applications/*', express.static('tests/applications'))

app.use('/configurations', (req, res) => {
  const { url } = req
  console.log(url)
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
