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
  
  return (
    <ItemCard>
      <pre>
        {JSON.stringify(value, null, 2)}
      </pre>
    </ItemCard>
  )
}
