import type { User } from '../types'

const SESSION_KEY = 'elimubora_session'

export function loadSession(): User | null {
  const saved = localStorage.getItem(SESSION_KEY)
  if (!saved) return null
  return JSON.parse(saved) as User
}

export function saveSession(user: User) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}
