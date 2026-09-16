// Utumaji wa barua pepe kwa PHPMailer kwenye hosting ya mcadventist.org.
// Node inaita script ya PHP kupitia HTTP — ona server/php-mailer/send.php.

export const PHP_MAILER_URL = process.env.PHP_MAILER_URL ?? ''
export const PHP_MAILER_SECRET = process.env.PHP_MAILER_SECRET ?? ''

export function isSmtpConfigured() {
  // Kimsingi tunahitaji URL na siri ya PHP mailer kwenye hosting
  return Boolean(PHP_MAILER_URL && PHP_MAILER_SECRET)
}

type MailPayload = {
  to: string
  subject: string
  body: string
}

export async function sendMailViaPhp({ to, subject, body }: MailPayload) {
  if (!PHP_MAILER_URL || !PHP_MAILER_SECRET) {
    throw new Error('PHP_MAILER_URL na PHP_MAILER hazijawekwa kwenye .env')
  }

  const response = await fetch(PHP_MAILER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, subject, body, key: PHP_MAILER_SECRET }),
  })

  const data = (await response.json()) as { ok?: boolean; message?: string }

  if (!response.ok || !data.ok) {
    throw new Error(data.message ?? `PHP mailer ilirudisha HTTP ${response.status}`)
  }
}
