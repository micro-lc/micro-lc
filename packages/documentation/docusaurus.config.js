const darkCodeTheme = require('prism-react-renderer/themes/dracula')
const lightCodeTheme = require('prism-react-renderer/themes/github')

const pluginContentDocsConfig = {
  breadcrumbs: true,
  editUrl: ({ versionDocsDirPath, docPath }) => {
    return `https://github.com/micro-lc/micro-lc/edit/v2/main/packages/documentation/${versionDocsDirPath}/${docPath}`
  },
  lastVersion: 'current',
  path: 'docs',
  routeBasePath: '/',
  showLastUpdateAuthor: true,
  sidebarPath: 'sidebars.js',
  versions: {
    '1.0.0': {
      label: '1.0.0',
      path: '1.0.0',
    },
    current: {
      label: '2.0.0',
      path: '',
    },
  },
}

const themeClassicConfig = {
  customCss: require.resolve('./src/css/custom.css'),
}

const themeConfig = {
  colorMode: {
    defaultMode: 'light',
    disableSwitch: true,
  },
  docs: {
    sidebar: {
      autoCollapseCategories: true,
      hideable: true,
    },
  },
  image: 'img/favicon.png',
  navbar: {
    hideOnScroll: false,
    items: [
      {
        docId: 'docs/introduction',
        label: 'Docs',
        position: 'left',
        type: 'doc',
      },
      {
        docId: 'api/micro-lc-web-component',
        label: 'API',
        position: 'left',
        type: 'doc',
      },
      {
        docId: 'add-ons/components/index',
        label: 'Add-ons',
        position: 'left',
        type: 'doc',
      },
      {
        label: 'Playground v2',
        target: '_blank',
        to: '/playground',
      },
      {
        position: 'right',
        type: 'docsVersionDropdown',
      },
      {
        'aria-label': 'GitHub repository',
        className: 'header-github-link',
        href: 'https://github.com/micro-lc/micro-lc/tree/v2/main',
        position: 'right',
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
  baseUrl: '/micro-lc/',
  favicon: 'img/favicon.png',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  organizationName: 'micro-lc',
  plugins: [
    ['@docusaurus/plugin-content-docs', pluginContentDocsConfig],
    '@docusaurus/plugin-content-pages',
  ],
  projectName: 'micro-lc',
  tagline: 'micro-lc project documentation',
  themeConfig,
  themes: [['@docusaurus/theme-classic', themeClassicConfig]],
  title: 'micro-lc',
  url: 'https://micro-lc.io',
}

module.exports = config
