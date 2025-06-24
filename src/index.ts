import type { WindowData } from './types/window-data'
import type {
  ContextData,
  OsType,
  DeviceType,
  BrowserType
} from './types/context-data'

export default class Glimpser {
  private readonly window: Window & typeof globalThis
  
  private readonly os: OsType
  private readonly device: DeviceType
  private readonly browser: BrowserType

  constructor() {
    if (typeof window === 'undefined') {
      throw new Error('[Glimpser] Incompatible environment: "window" is not defined.')
    }

    this.window = window

    this.os = this.detectOs()
    this.device = this.detectDevice()
    this.browser = this.detectBrowser()
  }

  public collect<K extends keyof WindowData>(key?: K): Readonly<WindowData | WindowData[K]> {
    const w = this.window

    const d = w.document
    const l = w.location
    const n = w.navigator
    const p = w.performance
    const s = w.screen

    const _closed = () => w.closed

    const _devicePixelRatio = () => w.devicePixelRatio

    const _document = () => ({
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
    })

    const _innerHeight = () => w.innerHeight

    const _innerWidth = () => w.innerWidth

    const _isSecureContext = () => w.isSecureContext

    const _location = () => ({
      hash: (l?.hash ?? '').replace(/^#/, ''),
      origin: l?.origin,
      pathname: l?.pathname,
      search: Object.fromEntries(new URLSearchParams(l?.search ?? ''))
    })

    const _name = () => w.name

    const _navigator = () => {
      const navigatorData: WindowData['navigator'] = {
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

      if (typeof n.connection !== 'undefined') {
        navigatorData.connection = {
          downlink: n.connection?.downlink,
          effectiveType: n.connection?.effectiveType,
          rtt: n.connection?.rtt,
          saveData: n.connection?.saveData
        }
      } else {
        console.warn('[Glimpser] connection property is not supported in this browser.')
      }

      if (typeof n.deviceMemory !== 'undefined') {
        navigatorData.deviceMemory = n.deviceMemory
      } else {
        console.warn('[Glimpser] deviceMemory property is not supported in this browser.')
      }

      if (typeof n.userAgentData !== 'undefined') {
        navigatorData.userAgentData = {
          brands: n.userAgentData?.brands,
          mobile: n.userAgentData?.mobile,
          platform: n.userAgentData?.platform
        }
      } else {
        console.warn('[Glimpser] userAgentData property is not supported in this browser.')
      }

      return navigatorData
    }

    const _outerHeight = () => w.outerHeight

    const _outerWidth = () => w.outerWidth

    const _performance = () => ({
      now: Math.floor(p?.now()),
      timeOrigin: Math.floor(p?.timeOrigin)
    })

    const _screen = () => ({
      availHeight: s?.availHeight,
      availWidth: s?.availWidth,
      height: s?.height,
      orientation: s?.orientation?.type,
      width: s?.width
    })

    const _scrollX = () => w.scrollX

    const _scrollY = () => w.scrollY

    const data = {
      closed: _closed,
      devicePixelRatio: _devicePixelRatio,
      document: _document,
      innerHeight: _innerHeight,
      innerWidth: _innerWidth,
      isSecureContext: _isSecureContext,
      location: _location,
      name: _name,
      navigator: _navigator,
      outerHeight: _outerHeight,
      outerWidth: _outerWidth,
      performance: _performance,
      screen: _screen,
      scrollX: _scrollX,
      scrollY: _scrollY
    }

    if (!!key && key in data) {
      return data[key]() as WindowData[K]
    }

    return Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, v()])
    ) as unknown as WindowData
  }

  public async getContext(): Promise<ContextData> {
    const d = this.collect('document') as WindowData['document']
    const l = this.collect('location') as WindowData['location']
    const n = this.collect('navigator') as WindowData['navigator']
    const p = this.collect('performance') as WindowData['performance']
    const s = this.collect('screen') as WindowData['screen']

    const os: ContextData['os'] = {
      name: this.os,
      theme: this.window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }

    const device: ContextData['device'] = {
      type: this.device
    }

    if (!!n?.deviceMemory) {
      const ram = n.deviceMemory

      if (ram <= 0.5) device.memory = 'very-low'
      if (ram <= 2) device.memory = 'low'
      if (ram <= 4) device.memory = 'medium'

      device.memory = 'high'       
    }

    const battery = await this.getBattery()

    if (!!battery) {
      device.battery = [
        battery?.level,
        battery?.charging,
        battery?.chargingTime,
        battery?.dischargingTime
      ]
    }

    const browser: ContextData['browser'] = {
      language: n?.language ?? n?.languages?.[0],
      legacy: this.isLegacyBrowser(),
      name: this.browser,
      onLine: n?.onLine
    }

    if (!!n?.connection) {
      browser.connection = [
        n.connection?.effectiveType,
        n.connection?.downlink,
        n.connection?.rtt,
        n.connection?.saveData
      ]
    }

    const session = {
      duration: p?.now,
      startAt: p?.timeOrigin
    }

    const document = {
      domain: l?.origin?.split('//')[1].split('/')[0],
      referrer: d?.referrer,
      title: d?.title,
      viewing: d?.visibilityState === 'visible' && d?.hasFocus
    }

    const screen: ContextData['screen'] = {
      height: [
        s?.height,
        s?.availHeight,
        this.collect('outerHeight') as number,
        this.collect('innerHeight') as number
      ],
      width: [
        s?.width,
        s?.availWidth,
        this.collect('outerWidth') as number,
        this.collect('innerWidth') as number
      ]
    }

    switch (s.orientation) {
      case 'landscape-primary':
        screen.orientation = 1
        break
      case 'landscape-secondary':
        screen.orientation = -1
        break
      case 'portrait-primary':
        screen.orientation = 2
        break
      case 'portrait-secondary':
        screen.orientation = -2
    }

    return {
      os,
      device,
      browser,
      session,
      document,
      screen
    }
  }

  public toJSON() {
    return this.collect()
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

  private async getBattery() {
    if (typeof this.window.navigator.getBattery === 'function') {
      const battery = await this.window.navigator?.getBattery()

      return {
        charging: battery?.charging,
        chargingTime: battery?.chargingTime,
        dischargingTime: battery?.dischargingTime,
        level: battery?.level
      }
    } else {
      console.warn('[Glimpser] getBattery method is not supported in this browser.')
    }

    return undefined
  }

  private isLegacyBrowser(): boolean {
    const tests: [string, boolean][] = [
      ['fetch', 'fetch' in window],
      ['Promise', 'Promise' in window],
      ['IntersectionObserver', 'IntersectionObserver' in window],
      ['ResizeObserver', 'ResizeObserver' in window],
      ['customElements', 'customElements' in window],
      ['Intl', 'Intl' in window],
      ['URLSearchParams', 'URLSearchParams' in window],
      ['CSS1Compat mode', document.compatMode === 'CSS1Compat']
    ]

    const failedTests = tests.filter(([_, passed]) => !passed)

    return failedTests.length >= 2
  }
}
