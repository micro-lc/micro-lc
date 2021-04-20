module.exports = (request, response) => {
  response
    .delay(1000)
    .send({
      isAuthNecessary: true,
      userInfoUrl: '/api/v1/microlc/user',
      userLogoutUrl: '/api/v1/microlc/user/logout'
    })
}
