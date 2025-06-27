import { ItemCard } from '@/components/item-card'

interface ScreenProps {
  value: {
    height?: (number | undefined)[]
    orientation?: number
    width?: (number | undefined)[]
  }
}

export function Screen({ value }: ScreenProps) {
  if (!value.height && !value.orientation && !value.width) {
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
