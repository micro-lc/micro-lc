import {addons} from '@storybook/addons'
import {create} from '@storybook/theming'

const theme = create({
  brandTitle: 'micro-lc',
  brandUrl: 'https://example.co',
  brandImage: 'https://avatars.githubusercontent.com/u/92730708?s=200&v=4',
  brandTarget: '_blank',
})

addons.setConfig({theme, enableShortcuts: false})
