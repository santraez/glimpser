export type BrowserData = {
  closed: boolean
  crypto: Partial<ExtendedCrypto>,
  navigator: Partial<ExtendedNavigator>
}

export type ExtendedCrypto = {
  [K in keyof Crypto]: unknown
}

export type ExtendedNavigator = {
  [K in keyof Navigator]: unknown
}

export class Glimpser {
  private readonly window: Window & typeof globalThis

  private data: BrowserData = {
    closed: false,
    crypto: {},
    navigator: {}
  }

  constructor() {
    if (typeof window === 'undefined') {
      throw new Error('[Glimpser] Incompatible environment: "window" is not defined.')
    }

    this.window = window
  }

  public getRaw(): BrowserData {
    this.data.closed = this.closed
    this.data.crypto = this.crypto
    this.data.navigator = this.navigator

    return this.data
  }

  get closed(): boolean {
    return this.window.closed
  }

  get crypto(): Partial<ExtendedCrypto> {
    return {
      getRandomValues: Array.from(this.window.crypto.getRandomValues(new Uint32Array(10))),
      randomUUID: this.window.crypto.randomUUID()
    }
  }

  get navigator(): Partial<ExtendedNavigator> {
    return {
      appName: this.window.navigator.appName,
      appVersion: this.window.navigator.appVersion,
      platform: this.window.navigator.platform,
      userAgent: this.window.navigator.userAgent
    }
  }
}

