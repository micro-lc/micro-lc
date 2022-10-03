import type { UserMenu } from '../config'

export const mapUserFields = (userInfo: Record<string, unknown>, userConfig?: Partial<UserMenu>): Record<string, unknown> => {
  const { userPropertiesMapping } = userConfig ?? {}

  if (!userPropertiesMapping) { return userInfo }

  return Object
    .entries(userInfo)
    .reduce<Record<string, unknown>>((mappedUser, [key, value]) => {
      return {
        ...mappedUser,
        [userPropertiesMapping[key] || key]: value,
      }
    }, {})
}
