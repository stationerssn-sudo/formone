import { randomInt } from 'node:crypto'

export function createResetCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*'
  return Array.from({ length: 6 }, () => alphabet[randomInt(alphabet.length)]).join('')
}
