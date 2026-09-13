import { useEffect, useState } from 'react'
import '../styles/admin.css'
import { apiGet, apiPost } from '../lib/api'
import type { Institution, Notice } from '../types'

export function AdminPage() {
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [institutionNotice, setInstitutionNotice] = useState<Notice>(null)
  const [batchNotice, setBatchNotice] = useState<Notice>(null)
  const [userNotice, setUserNotice] = useState<Notice>(null)

  useEffect(() => {
    apiGet<Institution[]>('/api/taasisi')
      .then(setInstitutions)
      .catch(() =>
        setInstitutionNotice({
          kind: 'error',
          text: 'Imeshindikana kupakia taasisi.',
        }),
      )
  }, [])

  async function submitForm(
    event: React.FormEvent<HTMLFormElement>,
    endpoint: string,
    setNotice: (notice: Notice) => void,
    onSuccess?: () => void,
  ) {
    event.preventDefault()
    setNotice({ kind: 'success', text: 'Inahifadhi taarifa...' })
    const form = event.currentTarget
    try {
      const { ok, data } = await apiPost<{ message: string }>(
        endpoint,
        Object.fromEntries(new FormData(form).entries()),
      )
      if (!ok) throw new Error(data.message)
      setNotice({ kind: 'success', text: data.message })
      form.reset()
      onSuccess?.()
    } catch (error) {
      setNotice({
        kind: 'error',
        text:
          error instanceof Error ? error.message : 'Taarifa hazijahifadhiwa.',
      })
    }
  }

  async function reloadInstitutions() {
    setInstitutions(await apiGet<Institution[]>('/api/taasisi'))
  }

  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <div>
          <span className="admin-kicker">ELIMUBORA CONTROL CENTER</span>
          <h1>Usimamizi wa mfumo</h1>
          <p>Sajili taasisi, vipindi vya masomo na watumiaji wa portal.</p>
        </div>
        <a className="admin-back" href="/">
          ← Rudi portal
        </a>
      </header>
      <section className="admin-card-grid">
        <article className="admin-card">
          <div className="admin-card-icon teal">01</div>
          <div className="admin-card-heading">
            <h2>Sajili taasisi</h2>
            <p>Ongeza taasisi itakayotumia mfumo.</p>
          </div>
          <form
            onSubmit={(event) =>
              submitForm(
                event,
                '/api/taasisi',
                setInstitutionNotice,
                reloadInstitutions,
              )
            }
          >
            <label>
              Jina la taasisi
              <input
                name="taasisi_name"
                required
                placeholder="Mfano: ElimuBora Academy"
              />
            </label>
            <button className="admin-submit" type="submit">
              Hifadhi taasisi <span>→</span>
            </button>
          </form>
          {institutionNotice && (
            <p className={`admin-notice ${institutionNotice.kind}`}>
              {institutionNotice.text}
            </p>
          )}
        </article>
        <article className="admin-card">
          <div className="admin-card-icon amber">02</div>
          <div className="admin-card-heading">
            <h2>Sajili batch</h2>
            <p>Weka kundi jipya la wanafunzi na ada zake.</p>
          </div>
          <form
            onSubmit={(event) => submitForm(event, '/api/batch', setBatchNotice)}
          >
            <label>
              Taasisi
              <select name="taasisi_id" required defaultValue="">
                <option value="" disabled>
                  Choose Institution
                </option>
                {institutions.map((institution) => (
                  <option value={institution.idtaasisi} key={institution.idtaasisi}>
                    {institution.taasisi_name}
                  </option>
                ))}
              </select>
            </label>
            <div className="admin-form-row">
              <label>
                Mwaka
                <input
                  name="year"
                  required
                  type="number"
                  min="2000"
                  max="2100"
                  placeholder="2026"
                />
              </label>
              <label>
                Ada
                <input
                  name="fee"
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="180000"
                />
              </label>
            </div>
            <div className="admin-form-row">
              <label>
                Kuanza
                <input name="starts" required type="date" />
              </label>
              <label>
                Kuisha
                <input name="ends" required type="date" />
              </label>
            </div>
            <button className="admin-submit" type="submit">
              Hifadhi batch <span>→</span>
            </button>
          </form>
          {batchNotice && (
            <p className={`admin-notice ${batchNotice.kind}`}>{batchNotice.text}</p>
          )}
        </article>
        <article className="admin-card">
          <div className="admin-card-icon navy">03</div>
          <div className="admin-card-heading">
            <h2>Sajili user</h2>
            <p>Fungua akaunti ya mhasibu au mwalimu.</p>
          </div>
          <form
            onSubmit={(event) => submitForm(event, '/api/users', setUserNotice)}
          >
            <label>
              Jina kamili
              <input name="full_name" required placeholder="Juma Mwamba" />
            </label>
            <div className="admin-form-row">
              <label>
                Nafasi
                <select name="position" required defaultValue="">
                  <option value="" disabled>
                    Choose Position
                  </option>
                  <option value="Mhasibu">Mhasibu</option>
                  <option value="Mwalimu">Mwalimu</option>
                  <option value="Treasurer">Treasurer</option>
                </select>
              </label>
              <label>
                Simu
                <input name="phone" required placeholder="0712 345 678" />
              </label>
            </div>
            <label>
              Barua pepe
              <input name="email" required type="email" placeholder="juma@example.com" />
            </label>
            <label>
              Taasisi
              <select name="taasisiid" required defaultValue="">
                <option value="" disabled>
                  Choose Institution
                </option>
                {institutions.map((institution) => (
                  <option value={institution.idtaasisi} key={institution.idtaasisi}>
                    {institution.taasisi_name}
                  </option>
                ))}
              </select>
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
            <button className="admin-submit" type="submit">
              Hifadhi user <span>→</span>
            </button>
          </form>
          {userNotice && (
            <p className={`admin-notice ${userNotice.kind}`}>{userNotice.text}</p>
          )}
        </article>
      </section>
    </main>
  )
}

export default AdminPage
