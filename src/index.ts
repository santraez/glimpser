import { hashFingerprint } from './helpers/converters'
import type { WindowData } from './types/window-data'
import type {
  ContextData,
  OsType,
  DeviceType,
  BrowserType,
  WorkerData
} from './types/context-data'

export default class Glimpser {
  private readonly window: Window & typeof globalThis

  private readonly os: OsType
  private readonly device: DeviceType
  private readonly browser: BrowserType
  private _context: ContextData

  private warnEnabled: boolean

  constructor(options: { warn?: boolean } = {}) {
    if (typeof window === 'undefined') {
      throw new Error('[Glimpser] Incompatible environment: "window" is not defined.')
    }

    this.window = window

    this.os = this.detectOs()
    this.device = this.detectDevice()
    this.browser = this.detectBrowser()
    this._context = this.getContext() as ContextData

    this.warnEnabled = options.warn ?? true
  }

  get context(): Readonly<ContextData> {
    return this._context
  }

  public collect<K extends keyof WindowData>(key: K): Readonly<WindowData[K]> {
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
        if (this.warnEnabled) {
          console.warn('[Glimpser] connection property is not supported in this browser.')
        }
      }

      if (typeof n.deviceMemory !== 'undefined') {
        navigatorData.deviceMemory = n.deviceMemory
      } else {
        if (this.warnEnabled) {
          console.warn('[Glimpser] deviceMemory property is not supported in this browser.')
        }
      }

      if (typeof n.userAgentData !== 'undefined') {
        navigatorData.userAgentData = {
          brands: n.userAgentData?.brands,
          mobile: n.userAgentData?.mobile,
          platform: n.userAgentData?.platform
        }
      } else {
        if (this.warnEnabled) {
          console.warn('[Glimpser] userAgentData property is not supported in this browser.')
        }
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

    return data[key]() as WindowData[K]
  }

  public async addBatteryData(): Promise<void> {
    if (typeof this.window.navigator.getBattery === 'function') {
      const battery = await this.window.navigator?.getBattery()

      this._context.device.battery = [
        battery?.level,
        battery?.charging,
        battery?.chargingTime,
        battery?.dischargingTime
      ]
    } else {
      if (this.warnEnabled) {
        console.warn('[Glimpser] getBattery method is not supported in this browser.')
      }
    }
  }

  public async addUserData(): Promise<void> {
    try {
      const workerData = await this.getWorkerData()

      if (!!workerData) {
        this._context.user = {
          city: workerData.cf?.city || workerData.headers?.['cf-ipcountry'],
          continent: workerData.cf?.continent,
          country: workerData.cf?.country,
          ipAddress: workerData.headers?.['x-real-ip'] || workerData.headers?.['cf-connecting-ip'],
          latitude: workerData.cf?.latitude,
          longitude: workerData.cf?.longitude,
          postalCode: workerData.cf?.postalCode,
          region: workerData.cf?.region,
          regionCode: workerData.cf?.regionCode,
          timezone: workerData.cf?.timezone
        }
      }
    } catch (error) {
      if (this.warnEnabled) {
        console.warn('[Glimpser] Failed to fetch user data.')
      }
    }
  }

  public refresh<K extends keyof ContextData>(key?: K): void {
    if (!!key && key in this._context) {
      this._context[key] = { ...this._context[key], ...this.getContext(key) }
    } else {
      this._context = { ...this._context, ...this.getContext() }
    }
  }

  public toJSON() {
    return {
      closed: this.collect('closed'),
      devicePixelRatio: this.collect('devicePixelRatio'),
      document: this.collect('document'),
      innerHeight: this.collect('innerHeight'),
      innerWidth: this.collect('innerWidth'),
      isSecureContext: this.collect('isSecureContext'),
      location: this.collect('location'),
      name: this.collect('name'),
      navigator: this.collect('navigator'),
      outerHeight: this.collect('outerHeight'),
      outerWidth: this.collect('outerWidth'),
      performance: this.collect('performance'),
      screen: this.collect('screen'),
      scrollX: this.collect('scrollX'),
      scrollY: this.collect('scrollY')
    }
  }

  private getContext<K extends keyof ContextData>(key?: K): Readonly<ContextData | ContextData[K]> {
    const d = this.collect('document')
    const l = this.collect('location')
    const n = this.collect('navigator')
    const p = this.collect('performance')
    const s = this.collect('screen')

    const _os = (): ContextData['os'] => ({
      name: this.os,
      theme: this.window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    })

    const _device = () => {
      const deviceData: ContextData['device'] = {
        type: this.device
      }

      if (!!n?.deviceMemory) {
        const ram = n.deviceMemory

        if (ram <= 0.5) deviceData.memory = 'very-low'
        if (ram <= 2) deviceData.memory = 'low'
        if (ram <= 4) deviceData.memory = 'medium'

        deviceData.memory = 'high'       
      }

      return deviceData
    }

    const _browser = () => {
      const browserData: ContextData['browser'] = {
        language: n?.language ?? n?.languages?.[0],
        legacy: this.isLegacyBrowser(),
        name: this.browser,
        onLine: n?.onLine
      }

      if (!!n?.connection) {
        browserData.connection = [
          n.connection?.effectiveType,
          n.connection?.downlink,
          n.connection?.rtt,
          n.connection?.saveData
        ]
      }

      return browserData
    }

    const _session = () => ({
      duration: p?.now,
      fingerprint: this.generateFingerprint(),
      origin: l?.origin?.split('//')[1],
      startAt: p?.timeOrigin
    })

    const _document = () => ({
      path: l?.origin ?? '' + l?.pathname ?? '',
      referrer: d?.referrer,
      title: d?.title,
      viewing: d?.visibilityState === 'visible' && d?.hasFocus
    })

    const _screen = () => {
      const screenData: ContextData['screen'] = {
        height: [
          s?.height,
          s?.availHeight,
          this.collect('outerHeight'),
          this.collect('innerHeight')
        ],
        width: [
          s?.width,
          s?.availWidth,
          this.collect('outerWidth'),
          this.collect('innerWidth')
        ]
      }

      switch (s.orientation) {
        case 'landscape-primary':
          screenData.orientation = 1
          break
        case 'landscape-secondary':
          screenData.orientation = -1
          break
        case 'portrait-primary':
          screenData.orientation = 2
          break
        case 'portrait-secondary':
          screenData.orientation = -2
      }

      return screenData
    }

    const data: Partial<{ [K in keyof ContextData]: () => ContextData[K] }> = {
      os: _os,
      device: _device,
      browser: _browser,
      session: _session,
      document: _document,
      screen: _screen
    }

    if (!!key && key in data && typeof data[key] === 'function') {
      return data[key]!() as ContextData[K]
    }
    
    return Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, v()])
    ) as unknown as ContextData
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

  private isLegacyBrowser(): boolean {
    const w = this.window

    const tests: [string, boolean][] = [
      ['fetch', 'fetch' in w],
      ['Promise', 'Promise' in w],
      ['IntersectionObserver', 'IntersectionObserver' in w],
      ['ResizeObserver', 'ResizeObserver' in w],
      ['customElements', 'customElements' in w],
      ['Intl', 'Intl' in w],
      ['URLSearchParams', 'URLSearchParams' in w],
      ['CSS1Compat mode', w.document.compatMode === 'CSS1Compat']
    ]

    const failedTests = tests.filter(([_, passed]) => !passed)

    return failedTests.length >= 2
  }

  private async getWorkerData(): Promise<WorkerData | undefined> {
    try {
      const response = await fetch('https://glimpser.santraez.workers.dev', {
        headers: {
          'x-glimpser-token': ',8y&(]h1Kq8N+{[,n*PKqIWKCRsotugvYzGp#]T,(?meHva>h(SH@3r|LvU)#zNR'
        }
      })

      const data = await response.json() as WorkerData
      
      return data
    } catch (error) {
      return undefined
    }
  }

  private generateFingerprint(): string {
    const d = this.collect('document')
    const l = this.collect('location')
    const n = this.collect('navigator')
    const s = this.collect('screen')

    const rawFingerprint = [
      n.platform,
      n.language,
      n.userAgent,
      n.hardwareConcurrency,
      n.maxTouchPoints,
      n.cookieEnabled,
      n.pdfViewerEnabled,
      n.webdriver,
      window.devicePixelRatio,
      s.width,
      s.height,
      s.availWidth,
      s.availHeight,
      s.orientation || 'unknown',
      l.origin?.replace(/^https?:\/\//, '') || '',
      l.pathname || '',
      d.referrer?.replace(/\/$/, '') || '',
      d.title || '',
      d.compatMode || '',
      d.characterSet || ''
    ].join('|')

    return hashFingerprint(rawFingerprint)
  }
}
