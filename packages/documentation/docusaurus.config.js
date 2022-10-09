const darkCodeTheme = require('prism-react-renderer/themes/dracula')
const lightCodeTheme = require('prism-react-renderer/themes/github')

const pluginContentDocsConfig = {
  breadcrumbs: true,
  path: 'docs',
  sidebarPath: 'sidebars.js',
}

const themeClassicConfig = {
  customCss: require.resolve('./src/css/custom.css'),
}

const themeConfig = {
  colorMode: {
    defaultMode: 'light',
  },
  image: 'img/favicon.png',
  navbar: {
    hideOnScroll: false,
    items: [
      {
        docId: 'introduction',
        label: 'Docs',
        position: 'left',
        type: 'doc',
      },
    ],
    logo: {
      alt: 'micro-lc',
      src: 'img/logo-light.png',
      srcDark: 'img/logo-dark.png',
    },
  },
  prism: {
    additionalLanguages: ['json5'],
    darkTheme: darkCodeTheme,
    theme: lightCodeTheme,
  },
}

/** @type {import('@docusaurus/types').Config} */
const config = {
  baseUrl: '/',
  favicon: 'img/favicon.png',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  plugins: [['@docusaurus/plugin-content-docs', pluginContentDocsConfig]],
  tagline: 'micro-lc project documentation',
  themeConfig,
  themes: [['@docusaurus/theme-classic', themeClassicConfig]],
  title: 'micro-lc',
  url: 'https://micro-lc.io',
}

module.exports = config