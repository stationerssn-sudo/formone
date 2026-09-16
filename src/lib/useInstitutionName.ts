import { useEffect, useState } from 'react'
import { apiGet } from './api'

const FALLBACK = 'ElimuBora'

/**
 * Inapakia jina la taasisi ya kwanza kutoka API na kulitumia kama jina la app.
 * pia inabadilisha document.title (title ya tab ya browser).
 */
export function useInstitutionName(): string {
  const [name, setName] = useState(FALLBACK)

  useEffect(() => {
    apiGet<{ idtaasisi: number; taasisi_name: string }[]>('/api/taasisi')
      .then((institutions) => {
        const first = institutions[0]?.taasisi_name?.trim()
        if (first) {
          setName(first)
          document.title = first
        }
      })
      .catch(() => {})
  }, [])

  return name
}
