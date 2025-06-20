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

  public toJSON(): WindowData {
    return this.data
  }

  public collect<K extends keyof WindowData>(key: K): WindowData[K] {
    return this.data[key]
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
      cookieEnabled: n.cookieEnabled,
      hardwareConcurrency: n.hardwareConcurrency,
      language: n.language,
      languages: [...n.languages],
      maxTouchPoints: n.maxTouchPoints,
      onLine: n.onLine,
      pdfViewerEnabled: n.pdfViewerEnabled,
      platform: n.platform,
      userActivation: n.userActivation.hasBeenActive,
      userAgent: n.userAgent,
      vendor: n.vendor,
      webdriver: n.webdriver
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

      navigatorData.deviceMemory = n.deviceMemory,
      navigatorData.userAgentData = {
        brands: n.userAgentData?.brands,
        mobile: n.userAgentData?.mobile,
        platform: n.userAgentData?.platform
      }
    }

    return {
      closed: this.window.closed,
      devicePixelRatio: this.window.devicePixelRatio,
      document: {
        characterSet: d.characterSet,
        compatMode: d.compatMode,
        contentType: d.contentType,
        dir: d.dir,
        fullscreenEnabled: d.fullscreenEnabled,
        hasFocus: d.hasFocus(),
        hidden: d.hidden,
        readyState: d.readyState,
        referrer: d.referrer,
        title: d.title,
        visibilityState: d.visibilityState
      },
      innerHeight: this.window.innerHeight,
      innerWidth: this.window.innerWidth,
      isSecureContext: this.window.isSecureContext,
      location: {
        hash: l.hash.replace(/^#/, ''),
        origin: l.origin,
        pathname: l.pathname,
        search: Object.fromEntries(new URLSearchParams(l.search))
      },
      name: this.window.name,
      navigator: navigatorData,
      outerHeight: this.window.outerHeight,
      outerWidth: this.window.outerWidth,
      performance: {
        now: p.now(),
        timeOrigin: p.timeOrigin
      },
      screen: {
        availHeight: s.availHeight,
        availWidth: s.availWidth,
        height: s.height,
        orientation: s.orientation.type,
        width: s.width
      },
      scrollX: this.window.scrollX,
      scrollY: this.window.scrollY
    }
  }

  private detectBrowser(): BrowserType {
    const w = this.window as any
    const n = this.window.navigator as any

    if ('InstallTrigger' in w) return 'firefox'

    if ('safari' in w || /apple/i.test(n.vendor)) {
      if (!('chrome' in w)) return 'safari'
    }

    if (n.userAgent.includes('Edg')) return 'edge'

    if (n.userAgent.includes('OPR') || n.userAgent.includes('Opera')) return 'opera'

    if (typeof n.brave?.isBrave === 'function') return 'brave'

    if ('userAgentData' in n || 'chrome' in w) return 'chrome'

    return 'unknown'
  }
}

