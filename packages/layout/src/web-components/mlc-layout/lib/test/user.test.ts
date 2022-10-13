import { expect } from '@open-wc/testing'

import type { UserMenu } from '../../types'
import { mapUserFields } from '../user'

describe('User', () => {
  describe('mapUserFields', () => {
    it('should map correctly', () => {
      const userInfo = {
        foo: 'bar',
        image: 'avatar',
        name: 'name',
      }

      const userConfig: Partial<UserMenu> = {
        userPropertiesMapping: {
          avatar: 'image',
        },
      }

      const result = mapUserFields(userInfo, userConfig)

      expect(result).to.deep.equal({
        avatar: 'avatar',
        foo: 'bar',
        name: 'name',
      })
    })
  })
})
