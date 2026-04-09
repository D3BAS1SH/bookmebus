# Auth Strategy Reference

## When to read this file
Read when scaffolding authentication. Strategy is chosen at runtime based on backend.

## Decision Matrix

| Backend | Recommended Auth |
|---------|-----------------|
| Supabase | Supabase Auth (built-in) |
| Next.js only | NextAuth.js / Auth.js v5 |
| External backend (NestJS/Spring/Elixir) | Custom JWT via httpOnly cookie |
| Any | Clerk (drop-in, if user wants zero-config hosted auth) |

---

## Custom JWT (External Backend)

### Middleware for protected routes
```typescript
// middleware.ts
import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/login', '/register', '/api/auth']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value
  const isPublic = PUBLIC_PATHS.some(p => request.nextUrl.pathname.startsWith(p))

  if (!isPublic && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] }
```

### BFF Route Handler for login
```typescript
// app/api/auth/login/route.ts
import { NextResponse } from 'next/server'
import { api } from '@/lib/fetch'
import { loginSchema } from '@/features/auth/types'

export async function POST(req: Request) {
  const body = loginSchema.parse(await req.json())
  const data = await api.post<{ accessToken: string }>('/auth/login', body)

  const res = NextResponse.json({ ok: true })
  res.cookies.set('access_token', data.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
  return res
}
```

---

## NextAuth.js v5 (Next.js-only backend)

```typescript
// src/lib/auth.ts
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { loginSchema } from '@/features/auth/types'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const { email, password } = loginSchema.parse(credentials)
        // validate against DB here
        return null
      },
    }),
  ],
  callbacks: {
    session: ({ session, token }) => ({ ...session, user: { ...session.user, id: token.sub } }),
  },
})
```

---

## Clerk (Any backend)

```typescript
// middleware.ts — replaces custom middleware
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublic = createRouteMatcher(['/login(.*)', '/register(.*)'])

export default clerkMiddleware((auth, req) => {
  if (!isPublic(req)) auth().protect()
})

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] }
```

Add to `t3-env`:
```typescript
server: { CLERK_SECRET_KEY: z.string().min(1) }
client: { NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1) }
```
