import type {
  BrowserType,
  NavigatorData,
  WindowData
} from './types/window-data'

export default class Glimpser {
  private readonly window: Window & typeof globalThis
  private readonly browser: BrowserType
  private data: WindowData

  constructor() {
    if (typeof window === 'undefined') {
      throw new Error('[Glimpser] Incompatible environment: "window" is not defined.')
    }

    this.window = window
    this.browser = this.detectBrowser()
    this.data = this.captureSnapshot()
  }

  public toJSON(): Readonly<WindowData> {
    if (typeof structuredClone === 'function') {
      return structuredClone(this.data)
    }

    return JSON.parse(JSON.stringify(this.data)) as Readonly<WindowData>
  }

  public collect<K extends keyof WindowData>(key: K): Readonly<WindowData[K]> {
    if (typeof structuredClone === 'function') {
      return structuredClone(this.data[key])
    }

    return JSON.parse(JSON.stringify(this.data[key])) as Readonly<WindowData[K]>
  }

  public refresh(): void {
    this.data = this.captureSnapshot()
  }

  public async getBattery(): Promise<void> {
    if (this.browser === 'firefox' || this.browser === 'safari') return

    const b = await this.window.navigator.getBattery()

    this.data.navigator.getBattery = {
      charging: b.charging,
      chargingTime: b.chargingTime,
      dischargingTime: b.dischargingTime,
      level: b.level
    }
  }

  private captureSnapshot(): WindowData {
    const d = this.window.document
    const l = this.window.location
    const n = this.window.navigator
    const p = this.window.performance
    const s = this.window.screen

    const navigatorData: NavigatorData = {
      cookieEnabled: n?.cookieEnabled,
      hardwareConcurrency: n?.hardwareConcurrency,
      language: n?.language,
      languages: [...(n?.languages ?? [])],
      maxTouchPoints: n?.maxTouchPoints,
      onLine: n?.onLine,
      pdfViewerEnabled: n?.pdfViewerEnabled,
      platform: n?.platform,
      userActivation: n?.userActivation?.hasBeenActive,
      userAgent: n?.userAgent,
      vendor: n?.vendor,
      webdriver: n?.webdriver
    }

    if (this.browser !== 'firefox' && this.browser !== 'safari') {
      if (this.browser !== 'brave') {
        navigatorData.connection = {
          downlink: n.connection?.downlink,
          effectiveType: n.connection?.effectiveType,
          rtt: n.connection?.rtt,
          saveData: n.connection?.saveData,
          type: n.connection?.type
        }
      }

      navigatorData.deviceMemory = n?.deviceMemory,
      navigatorData.userAgentData = {
        brands: n?.userAgentData?.brands,
        mobile: n?.userAgentData?.mobile,
        platform: n?.userAgentData?.platform
      }
    }

    return {
      closed: this.window.closed,
      devicePixelRatio: this.window.devicePixelRatio,
      document: {
        characterSet: d?.characterSet,
        compatMode: d?.compatMode,
        contentType: d?.contentType,
        dir: d?.dir,
        fullscreenEnabled: d?.fullscreenEnabled,
        hasFocus: d?.hasFocus(),
        hidden: d?.hidden,
        readyState: d?.readyState,
        referrer: d?.referrer,
        title: d?.title,
        visibilityState: d?.visibilityState
      },
      innerHeight: this.window.innerHeight,
      innerWidth: this.window.innerWidth,
      isSecureContext: this.window.isSecureContext,
      location: {
        hash: (l?.hash ?? '').replace(/^#/, ''),
        origin: l?.origin,
        pathname: l?.pathname,
        search: Object.fromEntries(new URLSearchParams(l?.search ?? ''))
      },
      name: this.window.name,
      navigator: navigatorData,
      outerHeight: this.window.outerHeight,
      outerWidth: this.window.outerWidth,
      performance: {
        now: p?.now(),
        timeOrigin: p?.timeOrigin
      },
      screen: {
        availHeight: s?.availHeight,
        availWidth: s?.availWidth,
        height: s?.height,
        orientation: s?.orientation?.type,
        width: s?.width
      },
      scrollX: this.window.scrollX,
      scrollY: this.window.scrollY
    }
  }

  private detectBrowser(): BrowserType {
    const w = this.window
    const n = this.window.navigator

    const ua = (n?.userAgent ?? '').toLowerCase()
    const vendor = (n?.vendor ?? '').toLowerCase()

    const brands = (n?.userAgentData?.brands ?? []).map(b => b.brand).join('; ').toLowerCase()

    const isFirefox = 'InstallTrigger' in w || ua.includes('firefox')
    const isSafari = /iphone|ipad|ipod/.test(ua) || vendor.includes('apple')
    const isEdge = brands.includes('microsoft') || ua.includes('edg/')
    const isOpera = 'opr' in w || brands.includes('opera') || ua.includes('opr/') || ua.includes('opera')
    const isBrave = typeof n?.brave?.isBrave === 'function' || brands.includes('brave')
    const isChrome = brands.includes('google') || 'chrome' in w || 'userAgentData' in n

    if (isFirefox) return 'firefox'
    if (isSafari) return 'safari'
    if (isEdge) return 'edge'
    if (isOpera) return 'opera'
    if (isBrave) return 'brave'
    if (isChrome) return 'chrome'
    
    return 'unknown'
  }
}
