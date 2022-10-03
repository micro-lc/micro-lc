import type { MenuItem } from '../config'

export const findMenuItemById = (
  menuItems: Partial<MenuItem>[],
  id: string
): Partial<MenuItem> | undefined => {
  for (const menuItem of menuItems) {
    if (menuItem.id === id) { return menuItem }

    if ('children' in menuItem) {
      const foundInChildren = findMenuItemById(menuItem.children ?? [], id)
      if (foundInChildren) { return foundInChildren }
    }
  }
}
