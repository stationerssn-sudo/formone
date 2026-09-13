// Kwenye production (Vercel), API na frontend ziko kwenye domain moja — tumia
// relative path. Kwa local dev, set VITE_API_URL=http://localhost:4000 kwenye .env.
export const apiUrl = import.meta.env.VITE_API_URL ?? ''

const unavailable = 'API haipatikani. Hakikisha server imeanzishwa.'

type ApiResult<T> = { ok: boolean; data: T }

export async function apiRequest<T>(
  path: string,
  options?: RequestInit,
): Promise<ApiResult<T>> {
  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
  const data = (await response.json()) as T
  return { ok: response.ok, data }
}

export async function apiGet<T>(path: string): Promise<T> {
  const { data } = await apiRequest<T>(path)
  return data
}

export async function apiPost<T>(
  path: string,
  body: object,
): Promise<ApiResult<T>> {
  return apiRequest<T>(path, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function apiUnavailableMessage(error?: unknown) {
  return error instanceof Error ? error.message : unavailable
}
