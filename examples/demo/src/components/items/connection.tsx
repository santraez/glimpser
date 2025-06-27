import { ItemCard } from '@/components/item-card'

interface ConnectionProps {
  value?: (number | boolean | 'slow-2g' | '2g' | '3g' | '4g' | undefined)[]
}

export function Connection({ value }: ConnectionProps) {
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
