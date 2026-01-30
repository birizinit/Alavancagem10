export type StorageType = "local" | "session"

function getStorage(type: StorageType): Storage | null {
  if (typeof window === "undefined") return null
  try {
    return type === "local" ? window.localStorage : window.sessionStorage
  } catch {
    return null
  }
}

export function safeGetItem(type: StorageType, key: string): string | null {
  const storage = getStorage(type)
  if (!storage) return null
  try {
    return storage.getItem(key)
  } catch {
    return null
  }
}

export function safeSetItem(type: StorageType, key: string, value: string): boolean {
  const storage = getStorage(type)
  if (!storage) return false
  try {
    storage.setItem(key, value)
    return true
  } catch {
    return false
  }
}

export function safeRemoveItem(type: StorageType, key: string): void {
  const storage = getStorage(type)
  if (!storage) return
  try {
    storage.removeItem(key)
  } catch {
    // Ignore storage errors for clients with blocked storage.
  }
}
