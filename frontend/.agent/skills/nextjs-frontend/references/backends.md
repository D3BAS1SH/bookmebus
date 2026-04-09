# External Backend / BFF Reference

## When to read this file
Read when backend is **NestJS, Spring Boot, Elixir/Phoenix, or any custom API**.

## BFF Decision Rule

```
Has secrets / auth tokens on backend?  → YES → Always use BFF Route Handlers
Backend is publicly accessible?         → YES → Can call directly from RSC (server-only)
Call is from a client component?        → YES → Always go through BFF (never expose URL)
```

## BFF Route Handler Template

```typescript
// app/api/[feature]/route.ts
import { NextResponse, type NextRequest } from 'next/server'
import { api } from '@/lib/fetch'
import { cookies } from 'next/headers'
import { featureItemListSchema } from '@/features/[feature]/types'

export async function GET(req: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  const data = await api.get('/feature', {
    headers: { Authorization: `Bearer ${token}` },
    tags: ['feature'],
    revalidate: 60,
  })

  const parsed = featureItemListSchema.parse(data)  // Validate backend response with Zod
  return NextResponse.json(parsed)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  const data = await api.post('/feature', body, {
    headers: { Authorization: `Bearer ${token}` },
  })

  return NextResponse.json(data, { status: 201 })
}
```

## lib/fetch.ts Server-Side Usage (RSC direct call)

In RSC or Route Handlers, `NEXT_PUBLIC_API_URL` resolves to the actual backend:

```typescript
// src/features/[feature]/api/queries.ts (server-side only)
import { api } from '@/lib/fetch'
import { featureItemListSchema } from '../types'

export async function getFeatureItems() {
  const data = await api.get('/feature', { tags: ['feature'], revalidate: 300 })
  return featureItemListSchema.parse(data)
}
```

## Client-Side Fetching (TanStack Query → BFF)

Client components never call the external backend URL. They call `/api/...` BFF endpoints:

```typescript
// src/features/[feature]/api/queries.ts (client-side TanStack Query)
import { useQuery } from '@tanstack/react-query'
import type { FeatureItem } from '../types'

export const featureKeys = {
  all: ['feature'] as const,
  list: () => [...featureKeys.all, 'list'] as const,
  detail: (id: string) => [...featureKeys.all, 'detail', id] as const,
}

export function useFeatureItems() {
  return useQuery({
    queryKey: featureKeys.list(),
    queryFn: async (): Promise<FeatureItem[]> => {
      const res = await fetch('/api/feature')
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
  })
}
```

## Backend-Specific Notes

### NestJS
- Runs on a different port (e.g. `:3001`) in dev
- Set `NEXT_PUBLIC_API_URL=http://localhost:3001` in `.env.local`
- In Turborepo, both apps run together via `turbo dev`

### Spring Boot
- Default port `:8080`
- May return `ProblemDetail` errors — add error shape to Zod error schema
- CORS must allow `http://localhost:3000` in Spring config for direct RSC calls

### Elixir/Phoenix
- Default port `:4000`
- Phoenix channels = WebSocket → see `references/websocket.md`
- JSON responses follow Phoenix conventions — validate carefully with Zod

## Cache Invalidation (Next.js App Router)
```typescript
// app/api/[feature]/route.ts — after mutation
import { revalidateTag } from 'next/cache'

export async function POST(req: NextRequest) {
  // ... mutation logic
  revalidateTag('feature')  // Bust RSC cache
  return NextResponse.json({ ok: true })
}
```
