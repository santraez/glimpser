export function hashFingerprint(str: string): string {
  let hash = 0

  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }

  const hashStr = Math.abs(hash).toString(36)

  return encodeBase64(hashStr)
}

export function encodeBase64(str: string): string {
  const bytes = new TextEncoder().encode(str)

  return btoa(String.fromCharCode(...bytes))
}
