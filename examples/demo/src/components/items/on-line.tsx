import { ItemCard } from '@/components/item-card'

interface OnLineProps {
  value?: boolean
}

export function OnLine({ value }: OnLineProps) {
  if (!value) {
    return null
  }
  
  return (
    <ItemCard>
      <span className={`${value ? 'animate-pulse text-green-500' : 'text-slate-300'} text-lg`}>
        &bull;
      </span>
    </ItemCard>
  )
}
