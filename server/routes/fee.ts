import { Router } from 'express'
import { pool } from '../db.js'

export const feeRouter = Router()

feeRouter.post('/api/fee', async (request, response) => {
  const studentId = Number(request.body.student_id)
  const amount = Number(request.body.amount)
  const payDate = String(request.body.pay_date ?? '')
  if (!studentId || !amount || amount <= 0 || !payDate) {
    return response.status(400).json({ message: 'Weka kiasi na tarehe ya malipo.' })
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(payDate)) {
    return response.status(400).json({ message: 'Tarehe ya malipo si sahihi.' })
  }
  try {
    const [students] = await pool.execute(
      `SELECT w.idwanafunzi, b.fee, COALESCE(SUM(f.amount), 0) AS paid_amount
       FROM wanafunzi w
       LEFT JOIN batch b ON b.idbatch = w.batch_id
       LEFT JOIN fee f ON f.student_id = w.idwanafunzi
       WHERE w.idwanafunzi = ?
       GROUP BY w.idwanafunzi, b.fee`,
      [studentId],
    )
    const student = (students as Array<{ idwanafunzi: number; fee: number; paid_amount: number }>)[0]
    if (!student) return response.status(404).json({ message: 'Mwanafunzi hakupatikana.' })
    if (Number(student.paid_amount) + amount > Number(student.fee)) {
      return response.status(400).json({ message: 'Kiasi kinazidi ada iliyobaki.' })
    }
    const payDateInt = Math.floor(new Date(`${payDate}T00:00:00Z`).getTime() / 1000)
    await pool.execute('INSERT INTO fee (student_id, pay_date, amount) VALUES (?, ?, ?)', [studentId, payDateInt, amount])
    response.status(201).json({ message: 'Malipo yamehifadhiwa.' })
  } catch (error) {
    console.error('Fee registration error:', error)
    response.status(500).json({ message: 'Malipo hayajahifadhiwa.' })
  }
})
