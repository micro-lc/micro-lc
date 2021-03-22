module.exports = (request, response) => {
  response.delay(1000).send({
    theming: {
      header: {
        pageTitle: 'Mia Care',
        favicon: 'https://www.mia-platform.eu/static/img/favicon/apple-icon-60x60.png'
      },
      logo: 'https://media-exp1.licdn.com/dms/image/C4D0BAQEf8hJ29mN6Gg/company-logo_200_200/0/1615282397253?e=2159024400&v=beta&t=tQixwAMJ5po8IkukxMyFfeCs-t-zZjyPgDfdy12opvI'
    },
    plugins: [{
      id: 'plugin-test-2',
      label: 'Second test plugin',
      icon: 'home',
      order: 2,
    }, {
      id: 'plugin-test-1',
      label: 'First test plugin',
      icon: 'clipboard',
      order: 1,
    }]
  })
}
