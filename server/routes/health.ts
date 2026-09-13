import { Router } from 'express'
import { pool } from '../db.js'

export const healthRouter = Router()

healthRouter.get('/api/health', async (_request, response) => {
  try {
    await pool.query('SELECT 1')
    response.json({ ok: true, database: 'connected' })
  } catch {
    response.status(503).json({ ok: false, database: 'unavailable' })
  }
})
