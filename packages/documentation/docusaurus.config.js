/** @type {import('@docusaurus/plugin-content-docs').PluginOptions} */
const pluginContentDocsConfig = {
  breadcrumbs: true,
  path: 'docs',
  sidebarPath: 'sidebars.js',
}

/** @type {import('@docusaurus/types').Config} */
const config = {
  baseUrl: '/',
  favicon: 'img/favicon.png',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  plugins: [
    ['@docusaurus/plugin-content-docs', pluginContentDocsConfig],
  ],
  tagline: 'micro-lc project documentation',
  themeConfig: {
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
      logo: { alt: 'micro-lc', src: 'img/logo.png' },
      title: 'micro-lc',
    },
  },
  themes: ['@docusaurus/theme-classic'],
  title: 'micro-lc',
  url: 'https://micro-lc.io',
}

module.exports = config
