const {theming, plugins, analytics} = require('../../../../configuration')

module.exports = (request, response) => {
  response
    .delay(1000)
    .send({theming, plugins, analytics})
}
