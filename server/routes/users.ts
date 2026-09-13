import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { pool } from '../db.js'
import { normalizePhone } from '../lib/phone.js'

export const usersRouter = Router()

usersRouter.post('/api/users', async (request, response) => {
  const fullName = String(request.body.full_name ?? '').trim()
  const position = String(request.body.position ?? '').trim()
  const phone = normalizePhone(String(request.body.phone ?? ''))
  const email = String(request.body.email ?? '').trim().toLowerCase()
  const password = String(request.body.password ?? '')
  const taasisiId = Number(request.body.taasisiid)
  if (
    !fullName ||
    !['Academic', 'Mhasibu', 'Mwalimu', 'Treasurer'].includes(position) ||
    !phone ||
    !email ||
    password.length < 8 ||
    !taasisiId
  ) {
    return response.status(400).json({ message: 'Jaza taarifa zote za user.' })
  }
  try {
    const passwordHash = await bcrypt.hash(password, 12)
    const [result] = await pool.execute(
      'INSERT INTO users (taasisiid, full_name, position, phone, email, password) VALUES (?, ?, ?, ?, ?, ?)',
      [taasisiId, fullName, position, phone, email, passwordHash],
    )
    response.status(201).json({ message: 'User amehifadhiwa.', id: (result as { insertId: number }).insertId })
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'ER_DUP_ENTRY') {
      return response.status(409).json({ message: 'Taarifa hii tayari ipo.' })
    }
    console.error('Admin user registration error:', error)
    response.status(500).json({ message: 'User hakuhifadhiwa.' })
  }
})
