import { useEffect, useState } from 'react'
import Glimpser, { type ContextData } from 'glimpser'

import { Os } from '@/components/items/os'
import { Theme } from '@/components/items/theme'
import { Battery } from '@/components/items/battery'
import { Memory } from '@/components/items/memory'
import { Device } from '@/components/items/device'
import { Connection } from '@/components/items/connection'
import { Language } from '@/components/items/language'
import { Browser } from '@/components/items/browser'
import { OnLine } from '@/components/items/on-line'
import { Duration } from '@/components/items/duration'
import { Fingerprint } from '@/components/items/fingerprint'
import { Country } from '@/components/items/country'
import { IpAddress } from '@/components/items/ip-address'
import { Geolocation } from '@/components/items/geolocation'
import { City } from '@/components/items/city'
import { Timezone } from '@/components/items/timezone'
import { Viewing } from '@/components/items/viewing'
import { Screen } from '@/components/items/screen'

export function GlimpserBox() {
  const [context, setContext] = useState<ContextData>()

  useEffect(() => {
    const client = new Glimpser()

    ;(async () => {
      await client.addBatteryData()
      await client.addUserData()

      setContext(client.context)
    })()
  }, [])

  return (
    <div className='w-xl h-xl bg-green-700 aspect-square grid grid-cols-5 gap-4 p-7 mx-auto'>
      <Os value={context?.os?.name} />
      <Theme value={context?.os?.theme} />
      <Battery value={context?.device?.battery} />
      <Memory value={context?.device?.memory} />
      <Device value={context?.device?.type} />
      <Connection value={context?.browser?.connection} />
      <Language value={context?.browser?.language} />
      <Browser value={context?.browser?.name} />
      <OnLine value={context?.browser?.onLine} />
      <Duration value={context?.session?.duration} />
      <Fingerprint value={context?.session?.fingerprint} />
      <Country value={context?.user?.country} />
      <IpAddress value={context?.user?.ipAddress} />
      <Geolocation
        value={{
          latitude: context?.user?.latitude,
          longitude: context?.user?.longitude
        }}
      />
      <City
        value={{
          city: context?.user?.city,
          postalCode: context?.user?.postalCode,
          region: context?.user?.region,
          regionCode: context?.user?.regionCode
        }}
      />
      <Timezone value={context?.user?.timezone} />
      <Viewing value={context?.document?.viewing} />
      <Screen
        value={{
          height: context?.screen?.height,
          orientation: context?.screen?.orientation,
          width: context?.screen?.width
        }}
      />
    </div>
  )
}
