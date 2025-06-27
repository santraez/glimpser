import type { BrowserType } from 'glimpser'

import { ItemCard } from '@/components/item-card'

interface BrowserProps {
  value?: BrowserType
}

export function Browser({ value }: BrowserProps) {
  if (!value) {
    return null
  }
  
  const icons = {
    chrome: {
      prefix: 'devicon',
      name: 'chrome-wordmark'
    },
    firefox: {
      prefix: 'logos',
      name: 'firefox'
    },
    safari: {
      prefix: 'devicon',
      name: 'safari'
    },
    edge: {
      prefix: 'logos',
      name: 'microsoft-edge'
    },
    brave: {
      prefix: 'logos',
      name: 'brave'
    },
    opera: {
      prefix: 'logos',
      name: 'opera'
    },
    unknown: {
      prefix: 'game-icons',
      name: 'ghost'
    }
  }
  
  return (
    <ItemCard>
      <img src={`https://api.iconify.design/${icons[value].prefix}/${icons[value].name}.svg`} alt={value} className='w-10 h-10' />
    </ItemCard>
  )
}
