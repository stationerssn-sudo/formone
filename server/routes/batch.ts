import { Router } from 'express'
import { pool } from '../db.js'

export const batchRouter = Router()

batchRouter.post('/api/batch', async (request, response) => {
  const taasisiId = Number(request.body.taasisi_id)
  const year = Number(request.body.year)
  const starts = String(request.body.starts ?? '')
  const ends = String(request.body.ends ?? '')
  const fee = Number(request.body.fee)
  if (!taasisiId || !year || !starts || !ends || Number.isNaN(fee)) {
    return response.status(400).json({ message: 'Jaza taarifa zote za batch.' })
  }
  try {
    const [result] = await pool.execute(
      'INSERT INTO batch (taasisi_id, year, starts, ends, fee) VALUES (?, ?, ?, ?, ?)',
      [taasisiId, year, starts, ends, fee],
    )
    response.status(201).json({ message: 'Batch imehifadhiwa.', id: (result as { insertId: number }).insertId })
  } catch (error) {
    console.error('Batch registration error:', error)
    response.status(500).json({ message: 'Batch haijahifadhiwa.' })
  }
})

batchRouter.get('/api/batch', async (_request, response) => {
  try {
    const [rows] = await pool.query(
      'SELECT idbatch, taasisi_id, year, starts, ends, fee FROM batch ORDER BY year DESC, starts DESC',
    )
    response.json(rows)
  } catch (error) {
    console.error('Batch list error:', error)
    response.status(500).json({ message: 'Batch hazijapatikana.' })
  }
})
