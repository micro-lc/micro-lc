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
      label: 'Href same window',
      icon: 'far fa-window-maximize',
      order: 2,
      integrationMode: 'href',
      externalLink: {
        url: 'https://google.it',
        sameWindow: true
      }
    }, {
      id: 'plugin-test-1',
      label: 'Href different window',
      icon: 'far fa-window-restore',
      order: 1,
      integrationMode: 'href',
      externalLink: {
        url: 'https://google.it',
        sameWindow: false
      }
    }, {
      id: 'plugin-test-3',
      label: 'IFrame',
      icon: 'fab fa-google',
      order: 3,
      integrationMode: 'iframe',
      pluginRoute: '/iframe',
      pluginUrl: 'https://www.google.com/webhp?igu=1'
    }, {
      id: 'qiankun-test',
      label: 'Qiankun plugin 1',
      icon: 'fab fa-react',
      order: 4,
      integrationMode: 'qiankun',
      pluginRoute: '/qiankun',
      pluginUrl: '//localhost:8764'
    }, {
      id: 'qiankun-as-iframe',
      label: 'Qiankun as iframe',
      icon: 'fab fa-reacteurope',
      order: 5,
      integrationMode: 'iframe',
      pluginRoute: '/qiankunIframe',
      pluginUrl: '//localhost:8764'
    }]
  })
}
