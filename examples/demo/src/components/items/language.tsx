import { ItemCard } from '@/components/item-card'

interface LanguageProps {
  value?: string
}

export function Language({ value }: LanguageProps) {
  if (!value) {
    return null
  }
  
  const code = value.split('-')[1].toLowerCase()
  
  return (
    <ItemCard>
      <img src={`https://flagcdn.com/${code}.svg`} alt={value} className='w-10' />
    </ItemCard>
  )
}
