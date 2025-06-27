import { useState } from 'react'
import type { OsType } from 'glimpser'

import { ItemCard } from '@/components/item-card'

interface OsProps {
  value?: OsType
}

export function Os({ value }: OsProps) {
  if (!value) {
    return null
  }

  const icons = {
    windows: {
      prefix: 'devicon',
      name: 'windows8'
    },
    apple: {
      prefix: 'fontisto',
      name: 'apple'
    },
    linux: {
      prefix: 'logos',
      name: 'linux-tux'
    },
    android: {
      prefix: 'openmoji',
      name: 'android'
    },
    chromeos: {
      prefix: 'logos',
      name: 'chrome'
    },
    unknown: {
      prefix: 'emojione',
      name: 'ghost'
    }
  }


  const icon = (value === 'macos' || value === 'ios' || value === 'ipados') ? icons.apple : icons[value]
  
  return (
    <ItemCard>
      <img src={`https://api.iconify.design/${icon.prefix}/${icon.name}.svg`} alt={value} className='w-10 h-10' />
    </ItemCard>
  )
}
