import { Router } from 'express'
import { pool } from '../db.js'

export const wanafunziRouter = Router()

wanafunziRouter.get('/api/wanafunzi', async (request, response) => {
  const search = String(request.query.search ?? '').trim()
  const searchValue = `%${search}%`
  try {
    const [rows] = await pool.execute(
      `SELECT w.idwanafunzi, w.regdate, w.student_name, w.address, w.parent_phone,
              b.idbatch, b.year, b.fee,
              COALESCE(SUM(f.amount), 0) AS paid_amount,
              GREATEST(COALESCE(b.fee, 0) - COALESCE(SUM(f.amount), 0), 0) AS remaining_amount
       FROM wanafunzi w
       LEFT JOIN batch b ON b.idbatch = w.batch_id
       LEFT JOIN fee f ON f.student_id = w.idwanafunzi
       WHERE ? = '' OR w.student_name LIKE ? OR w.address LIKE ? OR CAST(w.idwanafunzi AS CHAR) LIKE ?
       GROUP BY w.idwanafunzi, w.regdate, w.student_name, w.address, w.parent_phone, b.idbatch, b.year, b.fee
       ORDER BY w.idwanafunzi DESC`,
      [search, searchValue, searchValue, searchValue],
    )
    response.json(rows)
  } catch (error) {
    console.error('Student list error:', error)
    response.status(500).json({ message: 'Wanafunzi hawakupatikana.' })
  }
})

wanafunziRouter.post('/api/wanafunzi', async (request, response) => {
  const batchId = Number(request.body.batch_id)
  const studentName = String(request.body.student_name ?? '').trim()
  const address = String(request.body.address ?? '').trim()
  const parentPhone = String(request.body.parent_phone ?? '').trim()
  const regdate = String(request.body.regdate ?? '')

  if (!batchId || !studentName || !address || !parentPhone || !regdate) {
    response.status(400).json({ message: 'Jaza taarifa zote za mwanafunzi.' })
    return
  }

  try {
    const [result] = await pool.execute(
      'INSERT INTO wanafunzi (batch_id, regdate, student_name, address, parent_phone) VALUES (?, ?, ?, ?, ?)',
      [batchId, regdate, studentName, address, parentPhone],
    )
    response.status(201).json({ message: 'Mwanafunzi amesajiliwa.', id: (result as { insertId: number }).insertId })
  } catch (error) {
    console.error('Student registration error:', error)
    response.status(500).json({ message: 'Mwanafunzi hakusajiliwa.' })
  }
})
