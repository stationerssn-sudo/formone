import { Router } from 'express'
import { pool } from '../db.js'

export const healthRouter = Router()

healthRouter.get('/api/health', async (_request, response) => {
  try {
    await pool.query('SELECT 1')
    response.json({ ok: true, database: 'connected' })
  } catch (error) {
    response.status(503).json({
      ok: false,
      db: 'unavailable',
      error: error instanceof Error ? error.message : String(error),
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
    })
  }
})
