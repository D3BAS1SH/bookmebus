import { env } from '@/lib/env'

type FetchOptions = RequestInit & {
  tags?: string[]
  revalidate?: number | false
}

async function apiFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { tags, revalidate, ...init } = options

  // In this BFF architecture:
  // - Client-side calls should go to '/api/...' (our Next.js Route Handlers)
  // - Server-side calls (RSC) can go direct to the Spring Boot backend
  const baseUrl = typeof window === 'undefined' ? env.NEXT_PUBLIC_API_URL : ''

  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
    },
    next: {
      ...(tags ? { tags } : {}),
      ...(revalidate !== undefined ? { revalidate } : {}),
    },
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error?.message ?? `HTTP ${res.status}`)
  }

  return res.json() as Promise<T>
}

export const api = {
  get: <T>(path: string, options?: FetchOptions) =>
    apiFetch<T>(path, { method: 'GET', ...options }),
  post: <T>(path: string, body: unknown, options?: FetchOptions) =>
    apiFetch<T>(path, { method: 'POST', body: JSON.stringify(body), ...options }),
  put: <T>(path: string, body: unknown, options?: FetchOptions) =>
    apiFetch<T>(path, { method: 'PUT', body: JSON.stringify(body), ...options }),
  patch: <T>(path: string, body: unknown, options?: FetchOptions) =>
    apiFetch<T>(path, { method: 'PATCH', body: JSON.stringify(body), ...options }),
  delete: <T>(path: string, options?: FetchOptions) =>
    apiFetch<T>(path, { method: 'DELETE', ...options }),
}
