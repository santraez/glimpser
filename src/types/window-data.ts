export interface WindowData {
  closed?: boolean
  devicePixelRatio?: number
  document: DocumentData
  innerHeight?: number
  innerWidth?: number
  isSecureContext?: boolean
  location: LocationData
  name?: string
  navigator: Partial<ExtendedNavigator>
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

export type ExtendedNavigator = {
  [K in keyof Navigator]: unknown
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
