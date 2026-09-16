import { useState } from 'react'
import { Modal } from '../../components/Modal'
import { apiPost } from '../../lib/api'
import type { User } from '../../types'

type RegisterModalProps = {
  onClose: () => void
  onSwitchToLogin: () => void
}

export function RegisterModal({ onClose, onSwitchToLogin }: RegisterModalProps) {
  const [registrationMessage, setRegistrationMessage] = useState('')

  async function handleRegistration(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setRegistrationMessage('Inasajili taarifa...')
    const formData = new FormData(event.currentTarget)

    try {
      const { ok, data } = await apiPost<{ user: User; message?: string }>(
        '/api/auth/register',
        Object.fromEntries(formData.entries()),
      )
      setRegistrationMessage(
        ok ? `Usajili umekamilika. Karibu, ${data.user.name}.` : (data.message ?? ''),
      )
    } catch {
      setRegistrationMessage('API haipatikani. Hakikisha server imeanzishwa.')
    }
  }

  return (
    <Modal labelledBy="register-title" onClose={onClose}>
      <span className="modal-kicker">ELIMUBORA PORTAL</span>
      <h2 id="register-title">Jisajili kwenye mfumo.</h2>
      <p>Fungua akaunti ya kuanza safari ya ElimuBora.</p>
      <form onSubmit={handleRegistration}>
        <label>
          Jina kamili
          <input name="full_name" required placeholder="Juma Mwamba" />
        </label>
        <label>
          Nafasi
          <select className="form-select" name="position" defaultValue="" required>
            <option value="" disabled hidden>
              Choose Position
            </option>
            <option value="Academic">Academic</option>
            <option value="Mhasibu">Mhasibu</option>
            <option value="Mwalimu">Mwalimu</option>
            <option value="Treasurer">Treasurer</option>
          </select>
        </label>
        <label>
          Namba ya simu
          <input name="phone" required type="tel" placeholder="0712 345 678" pattern="(0|\\+?255)[0-9]{9}" title="Mfano: 0712 345 678" />
        </label>
        <label>
          Barua pepe
          <input name="email" required type="email" placeholder="juma@example.com" />
        </label>
        <label>
          Nenosiri
          <input
            name="password"
            required
            minLength={8}
            type="password"
            placeholder="Angalau herufi 8"
          />
        </label>
        <button className="button button-primary full-width" type="submit">
          Tengeneza akaunti <span>→</span>
        </button>
      </form>
      {registrationMessage && (
        <p className="login-message" role="status">
          {registrationMessage}
        </p>
      )}
      <button className="modal-switch" onClick={onSwitchToLogin}>
        Tayari una akaunti? Ingia
      </button>
    </Modal>
  )
}
