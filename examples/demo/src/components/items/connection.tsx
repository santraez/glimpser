import { ItemCard } from '@/components/item-card'

interface ConnectionProps {
  value?: (number | boolean | 'slow-2g' | '2g' | '3g' | '4g' | undefined)[]
}

export function Connection({ value }: ConnectionProps) {
  if (!value) {
    return null
  }

  const effectiveType = value[0]
  const downlink = value[1]
  const rtt = value[2]
  const saveData = value[3]
  
  return (
    <ItemCard>
      <div className='flex flex-col'>
        <span>{effectiveType}</span>
        <span>{downlink ? `${downlink} Mbps` : 'N/A'}</span>
        <span>{rtt ? `${rtt} ms` : 'N/A'}</span>
        <span>{saveData !== undefined ? (saveData ? 'Enabled' : 'Disabled') : 'N/A'}</span>
      </div>
    </ItemCard>
  )
}
