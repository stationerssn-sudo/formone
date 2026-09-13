import { useState } from 'react'
import './styles/portal.css'
import { LandingPage } from './pages/LandingPage'
import { DashboardPage } from './pages/DashboardPage'
import { loadSession, clearSession } from './lib/session'
import type { User } from './types'

function App() {
  const [sessionUser, setSessionUser] = useState<User | null>(() => loadSession())

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
