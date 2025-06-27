import { ItemCard } from '@/components/item-card'

interface BatteryProps {
  value?: (number | boolean | undefined)[]
}

export function Battery({ value }: BatteryProps) {
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
