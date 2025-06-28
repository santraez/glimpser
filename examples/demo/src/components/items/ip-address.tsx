import { ItemCard } from '@/components/item-card'

interface IpAddressProps {
  value?: string
}

export function IpAddress({ value }: IpAddressProps) {
  if (!value) {
    return null
  }
  
  return (
    <ItemCard>
      <span className='truncate'>{value}</span>
    </ItemCard>
  )
}
