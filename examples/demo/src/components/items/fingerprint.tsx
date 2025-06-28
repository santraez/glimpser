import { ItemCard } from '@/components/item-card'

interface FingerprintProps {
  value?: string
}

export function Fingerprint({ value }: FingerprintProps) {
  if (!value) {
    return null
  }
  
  return (
    <ItemCard>
      <span>{value}</span>
    </ItemCard>
  )
}
