import { secondsToTime } from '@/helpers/seconds-to-time'
import { ItemCard } from '@/components/item-card'

interface BatteryProps {
  value?: (number | boolean | undefined)[]
}

export function Battery({ value }: BatteryProps) {
  if (!value) {
    return null
  }

  const icons = {
    level20: {
      prefix: 'ic',
      name: 'baseline-battery-20'
    },
    level30: {
      prefix: 'ic',
      name: 'baseline-battery-30'
    },
    level50: {
      prefix: 'ic',
      name: 'baseline-battery-50'
    },
    level60: {
      prefix: 'ic',
      name: 'baseline-battery-60'
    },
    level80: {
      prefix: 'ic',
      name: 'baseline-battery-80'
    },
    level90: {
      prefix: 'ic',
      name: 'baseline-battery-90'
    },
    level100: {
      prefix: 'ic',
      name: 'baseline-battery-std'
    }
  }
 
  const level = !!value[0] ? +value[0] * 100 : 0
  const charging = !!value[1] ? value[1] : false
  const chargingTime = (!!value[2] && value[2] !== Infinity) ? secondsToTime(value[2] as number) : undefined
  const dischargingTime = (!!value[3] && value[3] !== Infinity) ? secondsToTime(value[3] as number) : undefined

  const icon = level <= 20
    ? icons.level20
    : level <= 30
      ? icons.level30
      : level <= 50
        ? icons.level50
        : level <= 60
          ? icons.level60
          : level <= 80
            ? icons.level80
            : level <= 90
              ? icons.level90
              : icons.level100
  
  return (
    <ItemCard>
      <div className='flex flex-col items-center justify-center'>
        <div className='flex flex-row items-center justify-center'>
          <img src={`https://api.iconify.design/${icon.prefix}/${icon.name}.svg`} alt={'battery level'} className='w-10 h-10 invert' />
          <span>{level}%</span>
        </div>
        
        <div className='flex flex-row items-center justify-center'>
          <span className={`${charging ? 'animate-pulse text-green-500' : 'text-slate-300'} text-lg`}>
            &bull;
          </span>
          {chargingTime ? <span>↑{chargingTime}</span> : null}
          {dischargingTime ? <span>↓{dischargingTime}</span> : null}
        </div>
      </div>
    </ItemCard>
  )
}
