import { useState } from 'react'
import { Modal } from '../../components/Modal'
import { apiPost } from '../../lib/api'
import { saveSession } from '../../lib/session'
import type { User } from '../../types'

type LoginModalProps = {
  onClose: () => void
  onLoggedIn: (user: User) => void
  onForgotPassword: () => void
  onSwitchToRegister: () => void
}

export function LoginModal({
  onClose,
  onLoggedIn,
  onForgotPassword,
  onSwitchToRegister,
}: LoginModalProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [loginMessage, setLoginMessage] = useState('')

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoginMessage('Inathibitisha taarifa...')
    const formData = new FormData(event.currentTarget)

    try {
      const { ok, data } = await apiPost<{ user: User; message?: string }>(
        '/api/auth/login',
        {
          identifier: formData.get('identifier'),
          password: formData.get('password'),
        },
      )
      if (ok) {
        saveSession(data.user)
        onLoggedIn(data.user)
      } else {
        setLoginMessage(data.message ?? 'Taarifa za kuingia si sahihi.')
      }
    } catch {
      setLoginMessage('API haipatikani. Hakikisha server imeanzishwa.')
    }
  }

  return (
    <Modal labelledBy="login-title" onClose={onClose}>
      <span className="modal-kicker">ELIMUBORA PORTAL</span>
      <h2 id="login-title">Karibu tena.</h2>
      <p>Weka taarifa zako kuendelea na safari yako ya kujifunza.</p>
      <form onSubmit={handleLogin}>
        <label>
          Barua pepe au nambari ya mtumiaji
          <input
            name="identifier"
            required
            placeholder="mwanafunzi@elimubora.ac.tz"
          />
        </label>
        <label>
          Nenosiri
          <div className="password-field">
            <input
              name="password"
              required
              type={showPassword ? 'text' : 'password'}
              placeholder="Weka nenosiri lako"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? 'Ficha' : 'Onyesha'}
            </button>
          </div>
        </label>
        <button className="button button-primary full-width" type="submit">
          Ingia kwenye mfumo <span>→</span>
        </button>
      </form>
      {loginMessage && (
        <p className="login-message" role="status">
          {loginMessage}
        </p>
      )}
      <button className="forgot-link reset-link" onClick={onForgotPassword}>
        Umesahau nenosiri?
      </button>
      <button className="modal-switch" onClick={onSwitchToRegister}>
        Huna akaunti? Jisajili
      </button>
    </Modal>
  )
}
