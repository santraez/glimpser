import { ItemCard } from '@/components/item-card'

interface TimezoneProps {
  value?: string
}

export function Timezone({ value }: TimezoneProps) {
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
