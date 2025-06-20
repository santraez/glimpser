import {
  Connection,
  GetBattery,
  UserAgentData
} from './window-data'

export {}

declare global {
  interface Navigator {
    readonly brave: { isBrave: boolean }
    readonly connection: Connection
    readonly deviceMemory: number
    readonly getBattery(): Promise<GetBattery>
    readonly platform: string
    readonly userAgentData: UserAgentData
    readonly vendor: string
  }
}
