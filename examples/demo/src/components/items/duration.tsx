import { ItemCard } from '@/components/item-card'

interface DurationProps {
  value?: number
}

export function Duration({ value }: DurationProps) {
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
