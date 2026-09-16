import { useState } from 'react'
import './styles/portal.css'
import { LandingPage } from './pages/LandingPage'
import { DashboardPage } from './pages/DashboardPage'
import { clearSession, loadSession, saveSession } from './lib/session'
import { useIdleSession } from './lib/idleSession'
import type { User } from './types'

function App() {
  const [sessionUser, setSessionUser] = useState<User | null>(() => loadSession())

  // Funga session kama mfumo umekaa bila kutumika kwa dakika 5.
  useIdleSession(
    () => {
      if (sessionUser) {
        clearSession()
        setSessionUser(null)
      }
    },
    // Kila shughuli inatunza session kuwa hai (inaonekana hata ukirefresh ukurasa).
    () => {
      if (sessionUser) saveSession(sessionUser)
    },
  )

  if (sessionUser) {
    return (
      <DashboardPage
        user={sessionUser}
        onLogout={() => {
          clearSession()
          setSessionUser(null)
        }}
      />
    )
  }

  return <LandingPage onLoggedIn={setSessionUser} />
}

export default App
