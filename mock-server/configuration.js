const theming = {
  header: {
    pageTitle: 'My Company',
    favicon: 'https://www.mia-platform.eu/static/img/favicon/apple-icon-60x60.png'
  },
  logo: {
    alt: 'My Company',
    url_light_image: 'https://raw.githubusercontent.com/lauragift21/giftegwuenu.dev/master/src/assets/img/logo.png',
    url_dark_image: 'https://raw.githubusercontent.com/lauragift21/giftegwuenu.dev/master/src/assets/img/logo-light.png',
    navigation_url: 'https://www.google.com'
  },
  variables: {
    primaryColor: 'red'
  },
  menuLocation: 'topBar'
}

const plugins = [
  {
    id: 'qiankun-test',
    label: 'Redoc',
    icon: 'fab fa-link',
    order: 3,
    integrationMode: 'qiankun',
    pluginRoute: '/qiankun',
    pluginUrl: '//localhost:8764',
<<<<<<< HEAD
=======
    props: {
      openApiSpecUrl : 'http://petstore.swagger.io/v2/swagger.json'
    },
>>>>>>> 5618fca... margin variable renamed
  },
  {
    id: 'plugin-test-1',
    label: 'Docusaurus',
    icon: 'fas fa-book',
    order: 1,
    integrationMode: 'qiankun',
    "pluginRoute": "/docusaurus/",
    "pluginUrl": "//localhost:8765",
    "props": {
      "docusaurusBaseUrl": "/docusaurus/",
      "docusaurusUrl": "http://localhost:8767"
  },
}
]

const analytics = {
  privacyLink: 'https://www.mia-platform.eu/img/Privacy_Policy_Website_EN.pdf',
  disclaimer: 'Questo sito utilizza cookie proprietari e di terze parti per assicurarti la migliore esperienza di navigazione. Per ulteriori informazioni, leggi la ',
  gtmId: 'GTM-000000'
}

const helpMenu = {
  helpLink: 'https://docs.mia-platform.eu/docs/business_suite/microlc/overview'
}
module.exports = {theming, plugins, analytics, helpMenu}
