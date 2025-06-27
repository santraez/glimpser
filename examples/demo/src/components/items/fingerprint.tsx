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
      <pre>
        {JSON.stringify(value, null, 2)}
      </pre>
    </ItemCard>
  )
}
