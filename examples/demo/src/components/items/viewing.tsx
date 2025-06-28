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
      <img src={`https://api.iconify.design/carbon/${value ? 'view-filled' : 'view-off-filled'}.svg`} alt={'battery level'} className='w-10 h-10 invert' />
    </ItemCard>
  )
}
