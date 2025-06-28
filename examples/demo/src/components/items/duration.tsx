import { millisecondsToTime } from '@/helpers/milliseconds-to-time'
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
      <span>{millisecondsToTime(value)}</span>
    </ItemCard>
  )
}
