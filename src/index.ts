import type {
  BrowserType,
  DeviceType,
  OsType,
  WindowData
} from './types/window-data'

export default class Glimpser {
  private readonly window: Window & typeof globalThis
  private data: WindowData
  private readonly os: OsType
  private readonly device: DeviceType
  private readonly browser: BrowserType

  constructor() {
    if (typeof window === 'undefined') {
      throw new Error('[Glimpser] Incompatible environment: "window" is not defined.')
    }

    this.window = window
    this.data = this.captureSnapshot()
    this.os = this.detectOs()
    this.device = this.detectDevice()
    this.browser = this.detectBrowser()
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

  public async getContext(): Promise<any> {
    const d = this.data

    const n = d.navigator
    const s = d.screen

    await this.getBattery()

    const os = {
      name: this.os,
      theme: this.window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }

    const device = {
      type: this.device,
      battery: [
        n?.getBattery?.level,
        n?.getBattery?.charging,
        n?.getBattery?.chargingTime,
        n?.getBattery?.dischargingTime
      ].filter(s => typeof s !== 'undefined')
    }

    const browser = {
      name: this.browser,
      language: n?.language ?? n?.languages?.[0]
    }

    const connection = [
      n?.onLine,
      n?.connection?.effectiveType,
      n?.connection?.downlink,
      n?.connection?.rtt,
      n?.connection?.saveData
    ].filter(s => typeof s !== 'undefined')
    
    const screen = {
      height: [
        s?.height,
        s?.availHeight,
        d?.outerHeight,
        d?.innerHeight
      ],
      orientation: s.orientation === 'landscape-primary'
        ? 1
        : s.orientation === 'landscape-secondary'
          ? -1
          : s.orientation === 'portrait-primary'
            ? 2
            : s.orientation === 'portrait-secondary'
              ? -2
              : 0,
      width: [
        s?.width,
        s?.availWidth,
        d?.outerWidth,
        d?.innerWidth
      ]
    }

    return {
      os,
      device,
      browser,
      connection,
      screen
    }
  }

  private async getBattery(): Promise<void> {
    if (this.browser === 'firefox' || this.browser === 'safari') return

    const b = await this.window.navigator?.getBattery()

    this.data.navigator.getBattery = {
      charging: b?.charging,
      chargingTime: b?.chargingTime,
      dischargingTime: b?.dischargingTime,
      level: b?.level
    }
  }

  private detectOs(): OsType {
    const n = this.window.navigator

    const platform = (n?.platform ?? '').toLowerCase()
    const ua = (n?.userAgent ?? '').toLowerCase()
    const uad = (n?.userAgentData?.platform ?? '').toLowerCase()

    const mtp = n?.maxTouchPoints ?? 0

    const isWindows = uad.includes('windows') || ua.includes('windows') || platform.includes('win')
    const isLinux = uad.includes('linux') || ua.includes('linux') || platform.includes('linux')
    const isAndroid = uad.includes('android') || ua.includes('android') || platform.includes('android') && mtp > 0
    const isChromeOs = uad.includes('cros') || ua.includes('cros') || platform.includes('cros')
    const isMacOs = uad.includes('mac') || ua.includes('macintosh') || platform.includes('mac')
    const isIpadOs = uad.includes('ipad') || ua.includes('ipad') || /ipad|mac/.test(platform) && mtp > 0
    const isIos = uad.includes('iphone') || ua.includes('iphone') || /iphone|mac/.test(platform) && mtp > 0

    if (isWindows) return 'windows'
    if (isLinux) return 'linux'
    if (isAndroid) return 'android'
    if (isChromeOs) return 'chromeos'
    if (isMacOs) return 'macos'
    if (isIpadOs) return 'ipados'
    if (isIos) return 'ios'
    
    return 'unknown'
  }

  private detectDevice(): DeviceType {
    const w = this.window
    const os = this.os

    const width = w.screen?.width ?? 0
    const mobileFlag = w.navigator?.userAgentData?.mobile ?? false
    const touchCapable = 'ontouchstart' in w

    const isTablet = os === 'ipados' || (os === 'android' && width >= 600 && width < 1240) && (mobileFlag || touchCapable)
    const isMobile = !isTablet && /ios|android/.test(os) && (mobileFlag || touchCapable)
    const isDesktop = /windows|macos|linux|chromeos/.test(os) && !mobileFlag

    if (isTablet) return 'tablet'
    if (isMobile) return 'mobile'
    if (isDesktop) return 'desktop'

    return 'unknown'
  }

  private detectBrowser(): BrowserType {
    const w = this.window
    const os = this.os

    const n = w.navigator

    const ua = (n?.userAgent ?? '').toLowerCase()
    const vendor = (n?.vendor ?? '').toLowerCase()

    const brands = (n?.userAgentData?.brands ?? []).map(b => b.brand).join('; ').toLowerCase()

    const isFirefox = 'InstallTrigger' in w || ua.includes('firefox')
    const isSafari = /iphone|ipad|ipod/.test(ua) || vendor.includes('apple') && /macos|ios|ipados/.test(os)
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

  private captureSnapshot(): WindowData {
    const w = this.window

    const d = w.document
    const l = w.location
    const n = w.navigator
    const p = w.performance
    const s = w.screen

    return {
      closed: w.closed,
      devicePixelRatio: w.devicePixelRatio,
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
      innerHeight: w.innerHeight,
      innerWidth: w.innerWidth,
      isSecureContext: w.isSecureContext,
      location: {
        hash: (l?.hash ?? '').replace(/^#/, ''),
        origin: l?.origin,
        pathname: l?.pathname,
        search: Object.fromEntries(new URLSearchParams(l?.search ?? ''))
      },
      name: w.name,
      navigator: {
        connection: {
          downlink: n?.connection?.downlink,
          effectiveType: n?.connection?.effectiveType,
          rtt: n?.connection?.rtt,
          saveData: n?.connection?.saveData,
          type: n?.connection?.type
        },
        cookieEnabled: n?.cookieEnabled,
        deviceMemory: n?.deviceMemory,
        hardwareConcurrency: n?.hardwareConcurrency,
        language: n?.language,
        languages: [...(n?.languages ?? [])],
        maxTouchPoints: n?.maxTouchPoints,
        onLine: n?.onLine,
        pdfViewerEnabled: n?.pdfViewerEnabled,
        platform: n?.platform,
        userActivation: n?.userActivation?.hasBeenActive,
        userAgent: n?.userAgent,
        userAgentData: {
          brands: n?.userAgentData?.brands,
          mobile: n?.userAgentData?.mobile,
          platform: n?.userAgentData?.platform
        },
        vendor: n?.vendor,
        webdriver: n?.webdriver
      },
      outerHeight: w.outerHeight,
      outerWidth: w.outerWidth,
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
      scrollX: w.scrollX,
      scrollY: w.scrollY
    }
  }
}
