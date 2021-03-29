module.exports = (request, response) => {
  response
    .delay(1000)
    .send({
      "email": "mocked.user@mia-platform.eu",
      "groups": [
        "users",
        "admin"
      ],
      "name": "Mocked User",
      "nickname": "mocked.user",
      "phone": "+393333333333",
      "picture": "https://i2.wp.com/cdn.auth0.com/avatars/md.png?ssl=1",
    })
}
