import { ItemCard } from '@/components/item-card'

interface ThemeProps {
  value?: 'dark' | 'light'
}

export function Theme({ value }: ThemeProps) {
  if (!value) {
    return null
  }
  
  const icons = {
    dark: {
      prefix: 'fluent-emoji-flat',
      name: 'crescent-moon'
    },
    light: {
      prefix: 'noto-v1',
      name: 'sun'
    }
  }
  
  return (
    <ItemCard>
      <img src={`https://api.iconify.design/${icons[value].prefix}/${icons[value].name}.svg`} alt={value} className='w-10 h-10' />
    </ItemCard>
  )
}
