export interface WindowData {
  closed?: boolean
  devicePixelRatio?: number
  document: DocumentData
  innerHeight?: number
  innerWidth?: number
  isSecureContext?: boolean
  location: LocationData
  name?: string
  navigator: NavigatorData
  outerHeight?: number
  outerWidth?: number
  performance: PerformanceData
  screen: ScreenData
  scrollX?: number
  scrollY?: number
}

export interface DocumentData {
  characterSet?: string
  compatMode?: string
  contentType?: string
  dir?: string
  fullscreenEnabled?: boolean
  hasFocus?: boolean
  hidden?: boolean
  readyState?: DocumentReadyState
  referrer?: string
  title?: string
  visibilityState?: DocumentVisibilityState
}

export interface LocationData {
  hash?: string
  origin?: string
  pathname?: string
  search?: Record<string, string>
}

export interface NavigatorData {
  connection?: Connection
  cookieEnabled?: boolean
  deviceMemory?: number
  getBattery?: GetBattery
  hardwareConcurrency?: number
  language?: string
  languages?: string[]
  maxTouchPoints?: number
  onLine?: boolean
  pdfViewerEnabled?: boolean
  platform?: string
  userActivation?: boolean
  userAgent?: string
  userAgentData?: UserAgentData
  vendor?: string
  webdriver?: boolean
}

export interface PerformanceData {
  now?: number
  timeOrigin?: number
}

export interface ScreenData {
  availHeight?: number
  availWidth?: number
  height?: number
  orientation?: OrientationType
  width?: number
}

export interface Connection {
  downlink?: number
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g'
  rtt?: number
  saveData?: boolean
  type?: 'bluetooth' | 'cellular' | 'ethernet' | 'none' | 'wifi' | 'wimax' | 'other' | 'unknown'
}

export interface GetBattery {
  charging?: boolean
  chargingTime?: number
  dischargingTime?: number
  level?: number
}

export interface UserAgentData {
  brands?: Record<string, string>[]
  mobile?: boolean
  platform?: string
}
