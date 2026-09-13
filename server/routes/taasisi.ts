import { Router } from 'express'
import { pool } from '../db.js'

export const taasisiRouter = Router()

taasisiRouter.get('/api/taasisi', async (_request, response) => {
  try {
    const [rows] = await pool.query('SELECT idtaasisi, taasisi_name FROM taasisi ORDER BY taasisi_name')
    response.json(rows)
  } catch (error) {
    console.error('Institutions error:', error)
    response.status(500).json({ message: 'Taasisi hazijapatikana.' })
  }
})

taasisiRouter.post('/api/taasisi', async (request, response) => {
  const name = String(request.body.taasisi_name ?? '').trim()
  if (!name) return response.status(400).json({ message: 'Weka jina la taasisi.' })
  try {
    const [result] = await pool.execute('INSERT INTO taasisi (taasisi_name) VALUES (?)', [name])
    response.status(201).json({ message: 'Taasisi imehifadhiwa.', id: (result as { insertId: number }).insertId })
  } catch (error) {
    console.error('Institution registration error:', error)
    response.status(500).json({ message: 'Taasisi haijahifadhiwa.' })
  }
})
