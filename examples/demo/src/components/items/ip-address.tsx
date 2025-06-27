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
      <pre>
        {JSON.stringify(value, null, 2)}
      </pre>
    </ItemCard>
  )
}
