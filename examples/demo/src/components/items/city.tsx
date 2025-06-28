import { ItemCard } from '@/components/item-card'

interface CityProps {
  value: {
    city?: string,
    postalCode?: string,
    region?: string,
    regionCode?: string
  }
}

export function City({ value }: CityProps) {
  if (!value.city && !value.postalCode && !value.region && !value.regionCode) {
    return null
  }

  const { city, postalCode, region } = value
  
  return (
    <ItemCard>
      <div className='flex flex-col gap-1'>
        <span>{city}, {region}</span>
        <span>{postalCode}</span>
      </div>
    </ItemCard>
  )
}
