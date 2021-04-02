module.exports = (request, response) => {
  response
    .delay(1000)
    .send({
      isAuthNecessary: false,
      authUrl: '/api/v1/microlc/user'
    })
}
