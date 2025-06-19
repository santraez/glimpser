export type WindowData = {
  closed: boolean
  devicePixelRatio: number,
  document: Partial<ExtendedDocument>
  frames: number
  history: number
  innerHeight: number
  innerWidth: number
  isSecureContext: boolean
  location: Partial<ExtendedLocation>
  name: string
  navigator: Partial<ExtendedNavigator>
  outerHeight: number
  outerWidth: number
  performance: Partial<ExtendedPerformance>
  screen: Partial<ExtendedScreen>
}

export type ExtendedDocument = {
  [K in keyof Document]: unknown
}

export type ExtendedLocation = {
  [K in keyof Location]: unknown
}

export type ExtendedNavigator = {
  [K in keyof Navigator]: unknown
}

export type ExtendedPerformance = {
  [K in keyof Performance]: unknown
}

export type ExtendedScreen = {
  [K in keyof Screen]: unknown
}

export class Glimpser {
  private readonly window: Window & typeof globalThis

  private data: Partial<WindowData> = {}

  constructor() {
    if (typeof window === 'undefined') {
      throw new Error('[Glimpser] Incompatible environment: "window" is not defined.')
    }

    this.window = window
  }

  public getRaw(): Partial<WindowData> {
    this.data.closed = this.closed
    this.data.devicePixelRatio = this.devicePixelRatio
    this.data.document = this.document
    this.data.frames = this.frames
    this.data.history = this.history
    this.data.innerHeight = this.innerHeight
    this.data.innerWidth = this.innerWidth
    this.data.isSecureContext = this.isSecureContext
    this.data.location = this.location
    this.data.name = this.name
    this.data.navigator = this.navigator
    this.data.outerHeight = this.outerHeight
    this.data.outerWidth = this.outerWidth
    this.data.performance = this.performance
    this.data.screen = this.screen

    return this.data
  }

  get closed(): boolean {
    return this.window.closed
  }

  get devicePixelRatio(): number {
    return this.window.devicePixelRatio
  }

  get document(): Partial<ExtendedDocument> {
    return {
      activeElement: this.window.document.activeElement?.nodeName,
      characterSet: this.window.document.characterSet,
      compatMode: this.window.document.compatMode,
      contentType: this.window.document.contentType,
      cookie: this.window.document.cookie.split('; ').filter(Boolean).length,
      dir: this.window.document.dir,
      doctype: this.window.document.doctype?.name,
      fonts: [...this.window.document.fonts].filter(Boolean).length,
      fullscreenElement: this.window.document.fullscreenElement?.nodeName,
      fullscreenEnabled: this.window.document.fullscreenEnabled,
      hasFocus: this.window.document.hasFocus(),
      hidden: this.window.document.hidden,
      images: [...this.window.document.images].filter(Boolean).length,
      links: [...this.window.document.links].filter(Boolean).length,
      pictureInPictureEnabled: this.window.document.pictureInPictureEnabled,
      readyState: this.window.document.readyState,
      referrer: this.window.document.referrer,
      scripts: [...this.window.document.scripts].filter(Boolean).length,
      title: this.window.document.title,
      visibilityState: this.window.document.visibilityState
    }
  }

  get frames(): number {
    return this.window.frames.length
  }

  get history(): number {
    return this.window.history.length
  }

  get innerHeight(): number {
    return this.window.innerHeight
  }

  get innerWidth(): number {
    return this.window.innerWidth
  }

  get isSecureContext(): boolean {
    return this.window.isSecureContext
  }

  get location(): Partial<ExtendedLocation> {
    return {
      hash: this.window.location.hash.replace(/^#/, ''),
      host: this.window.location.host,
      hostname: this.window.location.hostname,
      href: this.window.location.href,
      origin: this.window.location.origin,
      pathname: this.window.location.pathname,
      port: this.window.location.port,
      protocol: this.window.location.protocol,
      search: Object.fromEntries(new URLSearchParams(this.window.location.search))
    }
  }

  get name(): string {
    return this.window.name
  }

  get navigator(): Partial<ExtendedNavigator> {
    return {
      
    }
  }

  get outerHeight(): number {
    return this.window.outerHeight
  }

  get outerWidth(): number {
    return this.window.outerWidth
  }

  get performance(): Partial<ExtendedPerformance> {
    return {
      eventCounts: Object.fromEntries(this.window.performance.eventCounts),
      getEntries: this.window.performance.getEntries().length,
      now: this.window.performance.now(),
      timeOrigin: this.window.performance.timeOrigin,
    }
  }

  get screen(): Partial<ExtendedScreen> {
    return {
      availHeight: this.window.screen.availHeight,
      availWidth: this.window.screen.availWidth,
      colorDepth: this.window.screen.colorDepth,
      height: this.window.screen.height,
      orientation: this.window.screen.orientation?.type,
      pixelDepth: this.window.screen.pixelDepth,
      width: this.window.screen.width
    }
  }
}

