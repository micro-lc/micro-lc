const currentFileLocation = path.join(__dirname, 'configuration.json')

const configurationContent = fs.readFileSync(currentFileLocation, {encoding: 'utf8'})

module.exports = (request, response) => {
  response
    .delay(1000)
    .send(configurationContent)
}
