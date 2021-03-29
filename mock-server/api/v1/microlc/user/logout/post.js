module.exports = (request, response) => {
  response
    .delay(1000)
    .send({})
}
