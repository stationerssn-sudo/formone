import { useState } from 'react'
import { Modal } from '../../components/Modal'
import { apiPost } from '../../lib/api'

type ResetPasswordModalProps = {
  onClose: () => void
  onBackToLogin: () => void
}

export function ResetPasswordModal({
  onClose,
  onBackToLogin,
}: ResetPasswordModalProps) {
  const [resetStep, setResetStep] = useState<1 | 2 | 3>(1)
  const [resetEmail, setResetEmail] = useState('')
  const [resetCode, setResetCode] = useState('')
  const [resetMessage, setResetMessage] = useState('')

  async function submitReset(
    endpoint: string,
    body: Record<string, string>,
    nextStep?: 1 | 2 | 3,
  ) {
    setResetMessage('Inachakata...')
    try {
      const { ok, data } = await apiPost<{ message: string }>(endpoint, body)
      setResetMessage(data.message)
      if (ok && nextStep) setResetStep(nextStep)
    } catch {
      setResetMessage('API haipatikani. Hakikisha server imeanzishwa.')
    }
  }

  return (
    <Modal labelledBy="reset-title" onClose={onClose}>
      <span className="modal-kicker">PASSWORD RECOVERY</span>
      <h2 id="reset-title">Badili password.</h2>
      {resetStep === 1 && (
        <>
          <p>Thibitisha email na namba ya simu iliyosajiliwa.</p>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              const data = new FormData(event.currentTarget)
              const email = String(data.get('email'))
              setResetEmail(email)
              submitReset(
                '/api/auth/forgot-password',
                { email, phone: String(data.get('phone')) },
                2,
              )
            }}
          >
            <label>
              Email
              <input name="email" required type="email" placeholder="juma@example.com" />
            </label>
            <label>
              Namba ya simu
              <input name="phone" required placeholder="0712 345 678" />
            </label>
            <button className="button button-primary full-width" type="submit">
              Tuma code <span>→</span>
            </button>
          </form>
        </>
      )}
      {resetStep === 2 && (
        <>
          <p>Weka code ya characters 6 iliyotumwa kwenye email yako.</p>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              const code = String(new FormData(event.currentTarget).get('code'))
              setResetCode(code)
              submitReset(
                '/api/auth/verify-reset-code',
                { email: resetEmail, code },
                3,
              )
            }}
          >
            <label>
              Reset code
              <input
                name="code"
                required
                minLength={6}
                maxLength={6}
                placeholder="A7#bQ2"
              />
            </label>
            <button className="button button-primary full-width" type="submit">
              Thibitisha code <span>→</span>
            </button>
          </form>
        </>
      )}
      {resetStep === 3 && (
        <>
          <p>Weka password mpya yenye angalau characters 8.</p>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              const password = String(
                new FormData(event.currentTarget).get('password'),
              )
              submitReset('/api/auth/reset-password', {
                email: resetEmail,
                code: resetCode,
                password,
              })
            }}
          >
            <label>
              Password mpya
              <input
                name="password"
                required
                minLength={8}
                type="password"
                placeholder="Weka password mpya"
              />
            </label>
            <button className="button button-primary full-width" type="submit">
              Badili password <span>→</span>
            </button>
          </form>
        </>
      )}
      {resetMessage && (
        <p className="login-message" role="status">
          {resetMessage}
        </p>
      )}
      <button className="modal-switch" onClick={onBackToLogin}>
        Rudi kwenye login
      </button>
    </Modal>
  )
}
