import type { DeviceType } from 'glimpser'

import { ItemCard } from '@/components/item-card'

interface DeviceProps {
  value?: DeviceType
}

export function Device({ value }: DeviceProps) {
  if (!value) {
    return null
  }

  const icons = {
    desktop: {
      prefix: 'fluent-emoji-flat',
      name: 'laptop'
    },
    mobile: {
      prefix: 'emojione-v1',
      name: 'mobile-phone'
    },
    tablet: {
      prefix: 'streamline-ultimate-color',
      name: 'tablet'
    },
    unknown: {
      prefix: 'icon-park',
      name: 'ghost'
    }
  }
  
  return (
    <ItemCard>
      <img src={`https://api.iconify.design/${icons[value].prefix}/${icons[value].name}.svg`} alt={value} className='w-10 h-10' />
    </ItemCard>
  )
}
