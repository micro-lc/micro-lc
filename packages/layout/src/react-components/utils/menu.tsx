import Icon, { DownOutlined } from '@ant-design/icons'
import { useIcon } from '@micro-lc/iconic'
import type { MenuProps } from 'antd'
import type { ReactNode } from 'react'
import React, { createRef, Suspense } from 'react'

import type { Icon as IconConfig, MenuItem, Mode } from '../../web-components/mlc-layout/config'

import { getLocalizedText } from './i18n'

export type AntMenuItem = Required<MenuProps>['items'][number];

const DynamicIcon: React.FC<{ defaultSelector: string; iconConfig?: IconConfig }> = ({ defaultSelector, iconConfig }) => {
  const ref = createRef<HTMLSpanElement>()
  const IconSvg = useIcon(iconConfig?.selector ?? defaultSelector, iconConfig?.library ?? '@ant-design/icons-svg')

  return (
    <Suspense fallback={<span ref={ref}></span>}>
      <Icon className='anticon-link mlc-menu-item-icon' component={IconSvg} ref={ref} />
    </Suspense>
  )
}

interface MenuItemLabelProps {
  label: string
  rightIcon?: ReactNode
}

const MenuItemLabel: React.FC<MenuItemLabelProps> = ({ label, rightIcon }) => (
  <>
    <span>{label}</span>
    { rightIcon }
  </>
)

export const buildAntMenuItems = (configItems: MenuItem[], mode: Mode, lang?: string): AntMenuItem[] => {
  return configItems.reduce<AntMenuItem[]>((antMenuItems, configItem) => {
    const { type } = configItem

    const label = getLocalizedText(configItem.label ?? configItem.id, lang)

    switch (type) {
    case 'href': {
      const atnMenuItem: AntMenuItem = {
        icon: <DynamicIcon defaultSelector='LinkOutlined' iconConfig={configItem.icon}/>,
        key: configItem.id,
        label,
        title: label,
      }

      return [...antMenuItems, atnMenuItem]
    }

    case 'application': {
      const atnMenuItem: AntMenuItem = {
        icon: <DynamicIcon defaultSelector='DeploymentUnitOutlined' iconConfig={configItem.icon}/>,
        key: configItem.id,
        label,
        title: label,
      }

      return [...antMenuItems, atnMenuItem]
    }

    case 'category': {
      const rightIcon = mode !== 'topBar' ? undefined : <DownOutlined className='menu-item-icon-right menu-item-icon-right-sm'/>

      const atnMenuItem: AntMenuItem = {
        children: buildAntMenuItems(configItem.children ?? [], mode),
        icon: <DynamicIcon defaultSelector='ContainerOutlined' iconConfig={configItem.icon}/>,
        key: configItem.id,
        label: (<MenuItemLabel label={label} rightIcon={rightIcon}/>),
        title: label,
      }

      return [...antMenuItems, atnMenuItem]
    }

    case 'group': {
      const atnMenuItem: AntMenuItem = {
        children: buildAntMenuItems(configItem.children ?? [], mode),
        key: configItem.id,
        label,
        type: 'group',
      }

      return [...antMenuItems, atnMenuItem]
    }

    default: { return [...antMenuItems] }
    }
  }, [])
}
