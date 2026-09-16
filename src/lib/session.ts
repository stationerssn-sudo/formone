import type { User } from '../types'

const SESSION_KEY = 'elimubora_session'

/** Muda wa kupumzika (idle) kabla session haijafungwa: dakika 5. */
export const IDLE_TIMEOUT_MS = 5 * 60 * 1000

type StoredSession = { user: User; lastActive: number }

export function loadSession(): User | null {
  const saved = localStorage.getItem(SESSION_KEY)
  if (!saved) return null
  try {
    const parsed = JSON.parse(saved) as Partial<StoredSession> | User
    // Format mpya ina { user, lastActive }
    if (parsed && typeof parsed === 'object' && 'user' in parsed) {
      const stored = parsed as StoredSession
      if (Date.now() - stored.lastActive > IDLE_TIMEOUT_MS) {
        clearSession()
        return null
      }
      return stored.user
    }
    // Format ya zamani (user moja kwa moja) — rudisha kama ipo
    return parsed as User
  } catch {
    clearSession()
    return null
  }
}

export function saveSession(user: User) {
  const stored: StoredSession = { user, lastActive: Date.now() }
  localStorage.setItem(SESSION_KEY, JSON.stringify(stored))
}

/** Inatunza session kuwa "hai" — inaonyesha mtumiaji bado anatumia mfumo. */
export function touchSession() {
  const saved = localStorage.getItem(SESSION_KEY)
  if (!saved) return
  try {
    const stored = JSON.parse(saved) as StoredSession
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ user: stored.user, lastActive: Date.now() }),
    )
  } catch {
    // session iliyoharibika — acha loadSession iishike
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}
