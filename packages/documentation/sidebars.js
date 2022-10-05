// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  sidebar: [
    'introduction',
    'getting-started',
    {
      collapsed: true,
      collapsible: true,
      items: [
        'guides/composition',
        'guides/layout',
        'guides/routing',
        'guides/how-to-add-an-application',
        'guides/communication',
        'guides/style',
        'guides/reuse-third-party-libraries',
      ],
      label: 'Guides',
      type: 'category',
    },
    'configuration',
    {
      collapsed: true,
      collapsible: true,
      items: [
        'plugins/mlc-layout',
        'plugins/mlc-theme-manager',
      ],
      label: 'Plugins',
      type: 'category',
    },
    {
      collapsed: true,
      collapsible: true,
      items: [
        'advanced-guides/architecture',
      ],
      label: 'Advanced guides',
      type: 'category',
    },
    'migrating-from-v1',
  ],
}

module.exports = sidebars
