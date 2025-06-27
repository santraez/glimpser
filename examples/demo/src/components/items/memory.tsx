import { ItemCard } from '@/components/item-card'

interface MemoryProps {
  value?: 'very-low' | 'low' | 'medium' | 'high'
}

export function Memory({ value }: MemoryProps) {
  if (!value) {
    return null
  }

  const low = value === 'very-low'
  const medium = value === 'very-low' || value === 'low'
  const high = value === 'very-low' || value === 'low' || value === 'medium'

  return (
    <ItemCard>
      <div className='grid grid-cols-2 gap-2 items-center p-2'>
        <img src={'https://api.iconify.design/ic/baseline-memory.svg'} alt={value} className={'w-7 h-7 invert'} />
        <img src={'https://api.iconify.design/ic/baseline-memory.svg'} alt={value} className={`w-7 h-7 invert ${low ? 'opacity-50' : ''}`} />
        <img src={'https://api.iconify.design/ic/baseline-memory.svg'} alt={value} className={`w-7 h-7 invert ${medium ? 'opacity-50' : ''}`} />
        <img src={'https://api.iconify.design/ic/baseline-memory.svg'} alt={value} className={`w-7 h-7 invert ${high ? 'opacity-50' : ''}`} />
      </div>
    </ItemCard>
  )
}
