import { Modal } from '../../components/Modal'
import { apiPost, apiUnavailableMessage } from '../../lib/api'
import type { Batch } from '../../types'

type StudentRegistrationModalProps = {
  batches: Batch[]
  message: string
  onMessage: (message: string) => void
  onClose: () => void
  onRegistered: () => Promise<void>
}

export function StudentRegistrationModal({
  batches,
  message,
  onMessage,
  onClose,
  onRegistered,
}: StudentRegistrationModalProps) {
  async function handleStudentRegistration(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onMessage('Inasajili mwanafunzi...')
    const form = event.currentTarget
    try {
      const { ok, data } = await apiPost<{ message: string }>(
        '/api/wanafunzi',
        Object.fromEntries(new FormData(form).entries()),
      )
      onMessage(data.message)
      if (ok) {
        form.reset()
        await onRegistered()
      }
    } catch (error) {
      onMessage(apiUnavailableMessage(error))
    }
  }

  return (
    <Modal labelledBy="student-title" className="student-modal" onClose={onClose}>
      <span className="modal-kicker">STUDENT REGISTRATION</span>
      <h2 id="student-title">Sajili mwanafunzi.</h2>
      <p>Weka taarifa za mwanafunzi kwenye mfumo.</p>
      <form onSubmit={handleStudentRegistration}>
        <label>
          Mwaka wa batch
          <select className="form-select" name="batch_id" required defaultValue="">
            <option value="" disabled>
              Choose Year
            </option>
            {batches.map((batch) => (
              <option value={batch.idbatch} key={batch.idbatch}>
                {batch.year}
              </option>
            ))}
          </select>
        </label>
        <label>
          Jina la mwanafunzi
          <input name="student_name" required placeholder="Neema Emmanuel Kibona" />
        </label>
        <label>
          Anwani
          <input name="address" required placeholder="Kinondoni, Dar es Salaam" />
        </label>
        <label>
          Simu ya mzazi / mlezi
          <input name="parent_phone" required placeholder="0712 345 678" />
        </label>
        <label>
          Tarehe ya usajili
          <input name="regdate" required type="date" />
        </label>
        <button className="button button-primary full-width" type="submit">
          Hifadhi mwanafunzi <span>→</span>
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
