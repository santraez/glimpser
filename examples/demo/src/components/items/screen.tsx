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

  const {
    width,
    height,
    orientation
  } = value
  
  const heightValue = height?.[0] ?? 0
  const widthValue = width?.[0] ?? 0

  const aspectRatio = (widthValue > heightValue) ? widthValue : heightValue

  const heightRates = height?.map(h => Math.round((h as number / aspectRatio) * 100) / 100)
  const widthRates = width?.map(w => Math.round((w as number / aspectRatio) * 100) / 100)

  const maxPx = 50
  
  return (
    <ItemCard>
      <div
        style={{
          width: widthRates![0] * maxPx,
          height: heightRates![0] * maxPx,
        }}
        className='flex flex-row justify-start items-baseline-last bg-slate-950'
      >
        <div
          style={{
            width: widthRates![1] * maxPx,
            height: heightRates![1] * maxPx
          }}
          className='flex flex-row justify-start items-baseline-last bg-slate-800'
        >
          <div
            style={{
              width: widthRates![2] * maxPx,
              height: heightRates![2] * maxPx
            }}
            className='flex iflex-row justify-start items-baseline-last bg-slate-600'
          >
            <div
              style={{
                width: widthRates![3] * maxPx,
                height: heightRates![3] * maxPx
              }}
              className='flex iflex-row justify-start items-baseline-last bg-slate-400'
            >

            </div>
          </div>
        </div>
      </div>
    </ItemCard>
  )
}
