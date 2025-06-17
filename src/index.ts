export type ExtendedNavigator = {
  -readonly [K in keyof Navigator]: unknown
}

export type BrowserData = {
  navigator: Partial<ExtendedNavigator>
}

export class Glimpser {
  private data: BrowserData = {
    navigator: {}
  }

  public collect(): BrowserData {
    this.data.navigator = this.getNavigatorData()

    return this.data
  }

  public getRaw(): unknown {
    return {
      navigator: window.navigator
    }
  }

  private getNavigatorData(): Partial<ExtendedNavigator> {
    const result: Partial<ExtendedNavigator> = {}
    
    for (const key in window.navigator) {
      try {
        // @ts-expect-error: dynamic key access
        result[key] = window.navigator[key]
      } catch {
        // @ts-expect-error: some properties may throw errors when accessed
        result[key] = undefined
      }
    }
    
    return result
  }
}

