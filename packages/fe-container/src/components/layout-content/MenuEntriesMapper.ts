import {Plugin} from '@mia-platform/core'
import {MenuEntry} from '../side-menu/SideMenu'

const menuEntriesMapper = (plugins: Plugin[] = []) => {
  return plugins
    .sort((pluginA, pluginB) => (pluginA?.order || 0) - (pluginB?.order || 0))
    .map<MenuEntry>(plugin => ({
      id: plugin?.id,
      name: plugin?.label,
      pluginStrategy: plugin?.integrationMode,
      hrefConfig: plugin?.externalLink || {sameWindow: false, url: ''}
    }))
}

export default menuEntriesMapper
