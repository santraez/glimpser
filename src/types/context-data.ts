import { Connection } from './window-data'

export interface ContextData {
  os: {
    name: OsType
    theme: 'dark' | 'light'
  }

  device: {
    battery?: (number | boolean | undefined)[]
    memory?: 'very-low' | 'low' | 'medium' | 'high'       
    type: DeviceType
  }

  browser: {
    connection?: (boolean | number | Connection['effectiveType'] | undefined)[]
    language?: string
    legacy: boolean
    name: BrowserType
    onLine?: boolean
  }

  session : {
    duration?: number
    startAt?: number
  }

  document: {
    domain?: string
    referrer?: string
    title?: string
    viewing?: boolean
  }

  screen: {
    height: (number | undefined)[]
    orientation?: number
    width: (number | undefined)[]
  }
}

export type BrowserType = 'chrome' | 'firefox' | 'safari' | 'edge' | 'brave' | 'opera' | 'unknown'

export type OsType = 'windows' | 'macos' | 'linux' | 'android' | 'ios' | 'ipados' | 'chromeos' | 'unknown'

export type DeviceType = 'desktop' | 'mobile' | 'tablet' | 'unknown'
