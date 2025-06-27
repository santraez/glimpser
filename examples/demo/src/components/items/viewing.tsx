import { ItemCard } from '@/components/item-card'

interface ViewingProps {
  value?: boolean
}

export function Viewing({ value }: ViewingProps) {
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
