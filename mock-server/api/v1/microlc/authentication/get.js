const fs = require('fs')
const path = require('path')

const currentFileLocation = path.join(__dirname, 'authentication.json')

const authenticationContent = fs.readFileSync(currentFileLocation, {encoding: 'utf8'})

module.exports = (request, response) => {
  response
    .delay(1000)
    .send(authenticationContent)
}
