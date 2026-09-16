import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { pool } from '../db.js'
import { mailer, isSmtpConfigured } from '../lib/mailer.js'
import { normalizePhone } from '../lib/phone.js'
import { createResetCode } from '../lib/reset-code.js'

export const authRouter = Router()

authRouter.post('/api/auth/login', async (request, response) => {
  const identifier = String(request.body.identifier ?? '').trim()
  const password = String(request.body.password ?? '')

  if (!identifier || !password) {
    response.status(400).json({ message: 'Weka username na nenosiri.' })
    return
  }

  try {
    const [rows] = await pool.execute(
      'SELECT idusers, full_name, position, email, password FROM users WHERE email = ? LIMIT 1',
      [identifier],
    )
    const user = (
      rows as Array<{
        idusers: number
        full_name: string
        position: string
        email: string
        password: string
      }>
    )[0]
    const validPassword = user ? await bcrypt.compare(password, user.password) : false

    if (!user || !validPassword) {
      response.status(401).json({ message: 'Taarifa za kuingia si sahihi.' })
      return
    }

    response.json({
      user: { id: user.idusers, name: user.full_name, position: user.position, email: user.email },
    })
  } catch (error) {
    console.error('Login error:', error)
    response.status(500).json({ message: 'Huduma ya kuingia haipatikani kwa sasa.' })
  }
})

authRouter.post('/api/auth/register', async (request, response) => {
  const fullName = String(request.body.full_name ?? '').trim()
  const position = String(request.body.position ?? '').trim()
  const phone = normalizePhone(String(request.body.phone ?? ''))
  const email = String(request.body.email ?? '').trim().toLowerCase()
  const password = String(request.body.password ?? '')

  if (
    !fullName ||
    !['Academic', 'Mhasibu', 'Mwalimu', 'Treasurer'].includes(position) ||
    !phone ||
    !/^(0|\+?255)?[0-9]{9}$/.test(phone) ||
    !email ||
    password.length < 8
  ) {
    response.status(400).json({ message: 'Jaza taarifa zote kwa usahihi; nenosiri liwe na angalau herufi 8.' })
    return
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12)
    const [result] = await pool.execute(
      'INSERT INTO users (full_name, position, phone, email, password) VALUES (?, ?, ?, ?, ?)',
      [fullName, position, phone, email, passwordHash],
    )
    const userId = (result as { insertId: number }).insertId
    response.status(201).json({
      message: 'Usajili umekamilika.',
      user: { id: userId, name: fullName, position, email },
    })
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'ER_DUP_ENTRY') {
      response.status(409).json({ message: 'Barua pepe tayari inatumika.' })
      return
    }
    console.error('Registration error:', error)
    response.status(500).json({ message: 'Usajili haukupatikana kwa sasa.' })
  }
})

authRouter.post('/api/auth/forgot-password', async (request, response) => {
  const email = String(request.body.email ?? '').trim().toLowerCase()
  const phone = normalizePhone(String(request.body.phone ?? ''))
  if (!email || !phone) return response.status(400).json({ message: 'Weka email na namba ya simu.' })

  try {
    if (!isSmtpConfigured()) {
      response.status(503).json({
        message: 'SMTP haijawekwa. Jaza SMTP_HOST, SMTP_USER na SMTP_PASSWORD kwenye .env.',
      })
      return
    }
    const [rows] = await pool.execute('SELECT idusers, phone FROM users WHERE email = ? LIMIT 1', [email])
    const user = (rows as Array<{ idusers: number; phone: string }>).find(
      (candidate) => normalizePhone(candidate.phone) === phone,
    )
    if (!user) return response.status(404).json({ message: 'Email na namba ya simu hazifanani.' })

    const code = createResetCode()
    await pool.execute('DELETE FROM reset_code WHERE userid = ?', [user.idusers])
    await pool.execute('INSERT INTO reset_code (userid, code, time) VALUES (?, ?, ?)', [user.idusers, code, new Date()])
    await mailer.sendMail({
      from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
      to: email,
      subject: 'ElimuBora password reset code',
      text: `Code yako ya kubadili password ni: ${code}. Itumie ndani ya dakika 15.`,
    })
    response.json({ message: 'Code imetumwa kwenye email yako.' })
  } catch (error) {
    console.error('Forgot password error:', error)
    response.status(500).json({ message: 'Imeshindikana kutuma code. Hakikisha email server imewekwa.' })
  }
})

authRouter.post('/api/auth/verify-reset-code', async (request, response) => {
  const email = String(request.body.email ?? '').trim().toLowerCase()
  const code = String(request.body.code ?? '').trim()
  if (!email || !code) return response.status(400).json({ message: 'Weka email na code.' })
  try {
    const [rows] = await pool.execute(
      `SELECT r.idreset_code FROM reset_code r
       JOIN users u ON u.idusers = r.userid
       WHERE u.email = ? AND r.code = ? AND TIMESTAMPDIFF(MINUTE, r.time, NOW()) <= 15
       LIMIT 1`,
      [email, code],
    )
    if (!(rows as Array<{ idreset_code: number }>)[0]) {
      return response.status(400).json({ message: 'Code si sahihi au imekwisha muda.' })
    }
    response.json({ message: 'Code imethibitishwa.' })
  } catch (error) {
    console.error('Verify reset code error:', error)
    response.status(500).json({ message: 'Imeshindikana kuthibitisha code.' })
  }
})

authRouter.post('/api/auth/reset-password', async (request, response) => {
  const email = String(request.body.email ?? '').trim().toLowerCase()
  const code = String(request.body.code ?? '').trim()
  const password = String(request.body.password ?? '')
  if (!email || !code || password.length < 8) {
    return response.status(400).json({ message: 'Password iwe na angalau herufi 8.' })
  }
  try {
    const [rows] = await pool.execute(
      `SELECT r.idreset_code, r.userid FROM reset_code r
       JOIN users u ON u.idusers = r.userid
       WHERE u.email = ? AND r.code = ? AND TIMESTAMPDIFF(MINUTE, r.time, NOW()) <= 15
       LIMIT 1`,
      [email, code],
    )
    const reset = (rows as Array<{ idreset_code: number; userid: number }>)[0]
    if (!reset) return response.status(400).json({ message: 'Code si sahihi au imekwisha muda.' })
    const passwordHash = await bcrypt.hash(password, 12)
    await pool.execute('UPDATE users SET password = ? WHERE idusers = ?', [passwordHash, reset.userid])
    await pool.execute('DELETE FROM reset_code WHERE idreset_code = ?', [reset.idreset_code])
    response.json({ message: 'Password imebadilishwa. Sasa unaweza kuingia.' })
  } catch (error) {
    console.error('Reset password error:', error)
    response.status(500).json({ message: 'Imeshindikana kubadili password.' })
  }
})
