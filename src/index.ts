import type {
  ExtendedNavigator,
  WindowData,
  DocumentData,
  LocationData,
  PerformanceData,
  ScreenData
} from './types/window-data'

export default class Glimpser {
  private readonly window: Window & typeof globalThis

  constructor() {
    if (typeof window === 'undefined') {
      throw new Error('[Glimpser] Incompatible environment: "window" is not defined.')
    }

    this.window = window
  }

  get closed(): boolean {
    return this.window.closed
  }

  get devicePixelRatio(): number {
    return this.window.devicePixelRatio
  }

  get document(): DocumentData {
    return {
      characterSet: this.window.document.characterSet,
      compatMode: this.window.document.compatMode,
      contentType: this.window.document.contentType,
      dir: this.window.document.dir,
      fullscreenEnabled: this.window.document.fullscreenEnabled,
      hasFocus: this.window.document.hasFocus(),
      hidden: this.window.document.hidden,
      readyState: this.window.document.readyState,
      referrer: this.window.document.referrer,
      title: this.window.document.title,
      visibilityState: this.window.document.visibilityState
    }
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

  get location(): LocationData {
    return {
      hash: this.window.location.hash.replace(/^#/, ''),
      origin: this.window.location.origin,
      pathname: this.window.location.pathname,
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

  get performance(): PerformanceData {
    return {
      now: this.window.performance.now(),
      timeOrigin: this.window.performance.timeOrigin,
    }
  }

  get screen(): ScreenData {
    return {
      availHeight: this.window.screen.availHeight,
      availWidth: this.window.screen.availWidth,
      height: this.window.screen.height,
      orientation: this.window.screen.orientation?.type,
      width: this.window.screen.width,
    }
  }

  get scrollX(): number {
    return this.window.scrollX
  }

  get scrollY(): number {
    return this.window.scrollY
  }

  get all(): WindowData {
    return {
      closed: this.closed,
      devicePixelRatio: this.devicePixelRatio,
      document: this.document,
      innerHeight: this.innerHeight,
      innerWidth: this.innerWidth,
      isSecureContext: this.isSecureContext,
      location: this.location,
      name: this.name,
      navigator: this.navigator,
      outerHeight: this.outerHeight,
      outerWidth: this.outerWidth,
      performance: this.performance,
      screen: this.screen,
      scrollX: this.scrollX,
      scrollY: this.scrollY
    }
  }

  collect<K extends keyof WindowData>(key: K): WindowData[K] {
    return this[key]
  }

  toJSON(): WindowData {
    return this.all
  }
}

