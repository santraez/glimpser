import { ItemCard } from '@/components/item-card'

interface GeolocationProps {
  value: {
    latitude?: string,
    longitude?: string
  }
}

export function Geolocation({ value }: GeolocationProps) {
  if (!value.latitude || !value.longitude) {
    return null
  }
  
  return (
    <ItemCard>
      <a href={`https://www.google.com/maps?q=${value.latitude},${value.longitude}`} target='_blank'>
        <img src={'https://api.iconify.design/logos/google-maps.svg'} alt={'maps'} className='w-10 h-10' />
      </a>
    </ItemCard>
  )
}
