// Script ya kupima SMTP connection — tumia: node scripts/test-smtp.mts
import nodemailer from 'nodemailer'

const host = process.env.SMTP_HOST ?? 'smtp.mcadventist.org'
const port = Number(process.env.SMTP_PORT ?? 465)
const secure = process.env.SMTP_SECURE === 'true'

console.log(`Inajaribu kuconnect: ${host}:${port} (secure=${secure})`)

const transporter = nodemailer.createTransport({
  host,
  port,
  secure,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  connectionTimeout: 15_000,
})

try {
  await transporter.verify()
  console.log('✅ SMTP connection na auth zimefanikiwa!')
  process.exit(0)
} catch (error) {
  console.error('❌ Imeshindikana:', error)
  process.exit(1)
}
