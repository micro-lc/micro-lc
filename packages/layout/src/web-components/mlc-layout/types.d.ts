import type { BaseExtension, MicrolcApi } from '@micro-lc/orchestrator'

import type { Theme } from './lib/utils'

export interface User {
  avatar?: string
  name?: string
}

export type VoidFn = () => void

export type OnThemeChange = (newTheme: Theme) => void

interface MlcApiEvent {
  [key: string]: unknown
  theme: Theme
  user: Record<string, unknown>
}

export type MlcApi = MicrolcApi<BaseExtension, MlcApiEvent>

/** How the layout will be structured */
export type Mode = 'fixedSideBar' | 'overlaySideBar' | 'topBar'

/** Translatable text. It can be a string constant for all language or a map linking rfc5646 language codes to
 *  localized strings
 */
export type LocalizedText = string | Record<string, string>

/** Definition of a dynamically loaded icon */
export interface Icon {
  /** Library from witch the icon is pulled */
  library: '@ant-design/icons-svg' | '@fortawesome/free-regular-svg-icons' | '@fortawesome/free-solid-svg-icons'

  /** Name of the icon according to the chosen library */
  selector: string
}

export interface HrefMenuItem {
  /** Link's destination */
  href: string

  icon?: Icon

  /** Unique identifier of the href */
  id: string

  label?: LocalizedText

  /** Specifies where to open the linked document */
  target?: '_blank' | '_self' | '_parent' | '_top'

  /** Type of the item: hyperlink to another page */
  type: 'href'
}

export interface ApplicationMenuItem {
  icon?: Icon

  /** Unique identifier of the corresponding micro-lc application  */
  id: string

  label?: LocalizedText

  /** Type of the item: micro-lc application */
  type: 'application'
}

export interface CategoryMenuItem {
  children?: MenuItem[]

  icon?: Icon

  /** Unique identifier of the category */
  id: string

  label?: LocalizedText

  /** Type of the item: collapsable sub-menu */
  type: 'category'
}

export interface GroupMenuItem {
  children?: MenuItem[]

  /** Unique identifier of the group */
  id: string

  label?: LocalizedText

  /** Type of the item: non-collapsable group of items */
  type: 'group'
}

export type MenuItem = HrefMenuItem | ApplicationMenuItem | CategoryMenuItem | GroupMenuItem

/** Information needed to display the company logo */
export interface Logo {
  /** Alternative text to display if the logo is not found  */
  altText?: string

  /** Link to navigate to when the logo is clicked */
  onClickHref?: string

  /** URL of the logo image */
  url?:
    | string
    | {
        /** URL of the logo image for dark theme */
        urlDarkImage: string

        /** URL of the logo image for light theme */
        urlLightImage: string
      }
}

/** Configuration of the help menu rendered on the top bar */
export interface HelpMenu {
  /** Link to the help page */
  helpHref: string
}

/** Configuration of the user menu rendered on the top bar */
export interface UserMenu {
  /** Configuration needed to perform user logout */
  logout?: {
    /** Method used to perform the call to the URL specified in the 'url' property */
    method?: 'GET' | 'POST'

    /** URL to be redirected to after the logout */
    redirectUrl?: string

    /** URL called to log out the user. The method used is the one specified in the 'method' property */
    url?: string
  }

  /** URL called in GET to retrieve user data */
  userInfoUrl: string

  /** Mapping between the properties returned from the user info URL call and the ones expected by the component */
  userPropertiesMapping?: Record<string, 'name' | 'avatar' | string>
}

/** Configuration for the HTML document head */
export interface Head {
  /** Url of the fav icon */
  favIconUrl?: string

  /** Title of the tab */
  title?: string
}
