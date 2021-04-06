module.exports = (request, response) => {
  response
    .delay(1000)
    .send({
      isAuthNecessary: false,
      userInfoUrl: '/api/v1/microlc/user'
    })
}
