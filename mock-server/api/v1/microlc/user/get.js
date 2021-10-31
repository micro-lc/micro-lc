const path = require('path')
const fs = require('fs')

const currentFileLocation = path.join(__dirname, 'user.json')

const userContent = fs.readFileSync(currentFileLocation, {encoding: 'utf8'})

module.exports = (request, response) => {
  response
    .delay(1000)
    .send(userContent)
}
