export function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, '')
  return digits.startsWith('255') ? `0${digits.slice(3)}` : digits
}
