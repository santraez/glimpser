import { ItemCard } from '@/components/item-card'

interface CountryProps {
  value?: string
}

export function Country({ value }: CountryProps) {
  if (!value) {
    return null
  }

  const code = value.toLowerCase()
  
  return (
    <ItemCard>
      <img src={`https://flagcdn.com/${code}.svg`} alt={value} className='w-10' />
    </ItemCard>
  )
}
