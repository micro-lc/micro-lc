import {Plugin} from '@mia-platform/core/dist/models/configuration/plugin/Plugin'

import {MenuEntry} from '../side-menu/SideMenu'

const menuEntriesMapper: (plugins?: Plugin[]) => MenuEntry[] = (plugins) => {
  return (plugins || [])
    .sort((pluginA, pluginB) => (pluginA?.order || 0) - (pluginB?.order || 0))
    .map(plugin => ({
      id: plugin?.id || '',
      name: plugin?.label || ''
    }))
}

export default menuEntriesMapper
