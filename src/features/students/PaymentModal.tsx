import { Modal } from '../../components/Modal'
import { apiPost } from '../../lib/api'
import type { Student } from '../../types'

type PaymentModalProps = {
  student: Student
  message: string
  onMessage: (message: string) => void
  onClose: () => void
  onPaid: () => Promise<void>
}

export function PaymentModal({
  student,
  message,
  onMessage,
  onClose,
  onPaid,
}: PaymentModalProps) {
  async function handlePayment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    onMessage('Inahifadhi malipo...')
    try {
      const { ok, data } = await apiPost<{ message: string }>('/api/fee', {
        student_id: student.idwanafunzi,
        ...Object.fromEntries(new FormData(form).entries()),
      })
      onMessage(data.message)
      if (ok) {
        await onPaid()
        form.reset()
      }
    } catch {
      onMessage('API haipatikani. Hakikisha server imeanzishwa.')
    }
  }

  return (
    <Modal labelledBy="payment-title" onClose={onClose}>
      <span className="modal-kicker">MALIPO YA ADA</span>
      <h2 id="payment-title">Jaza malipo.</h2>
      <p>
        Rekodi malipo ya ada kwa <strong>{student.student_name}</strong> (ID:{' '}
        {student.idwanafunzi}).
      </p>
      <form onSubmit={handlePayment}>
        <label>
          Kiasi kilicholipwa (TZS)
          <input
            name="amount"
            required
            type="number"
            min="1"
            step="1"
            placeholder="50000"
          />
        </label>
        <label>
          Tarehe ya malipo
          <input name="pay_date" required type="date" />
        </label>
        <button className="button button-primary full-width" type="submit">
          Hifadhi malipo
        </button>
      </form>
      {message && (
        <p className="login-message" role="status">
          {message}
        </p>
      )}
    </Modal>
  )
}
