---
name: nextjs-frontend
description: >
  Expert Next.js frontend architect for production-grade applications using the App Router.
  Use this skill for ANY of the following: scaffolding a new Next.js project, auditing or
  refactoring an existing project's directory structure, setting up feature-based architecture,
  configuring state management (Zustand or React-only), adding WebSocket/real-time support,
  scaffolding a BFF API layer, setting up Supabase or external backend integration, configuring
  shadcn/ui + Tailwind, adding Zod validation, setting up t3-env, writing component skeletons,
  creating modular feature directories, or structuring any Next.js frontend codebase.
  Trigger this skill even for casual requests like "scaffold a dashboard feature", "add websocket
  to my next app", "how should I structure my Next.js project", or "set up state management".
  Always use this skill before writing any Next.js frontend code or making structural decisions.
---

# Next.js Frontend Skill

A production-grade, opinionated scaffold system for Next.js App Router projects.

---

## Step 0 — PROJECT.md Check (Always Do This First)

Before anything else, check if a `PROJECT.md` exists in the project root.

### If PROJECT.md EXISTS → Resume Mode
Read it immediately. Extract all previously decided values:
- Skip any interview questions already answered
- Only ask about things that are missing or the user explicitly wants to change
- Confirm with the user: _"I found your PROJECT.md — I'll use these settings. Anything you want to change before we proceed?"_
- After any new decisions are made, **update PROJECT.md** to reflect them

### If PROJECT.md does NOT EXIST → Setup Mode
Run the full interview below, then **generate PROJECT.md as the very last step** before writing any code.
See `references/project-md-template.md` for the exact format to generate.

### PROJECT.md Rules
- It lives at the **project root** and is **committed to git** — it's team documentation
- It is the single source of truth for all architectural decisions
- Claude must **always update it** when new features, decisions, or domain context are added
- It has two sections: **Decisions** (tech choices) and **Domain** (business logic, entities, rules)
- The Domain section is freeform — Claude fills it from what the user describes about their product

---

## Step 1 — Read Existing Structure (Always Do This)

Before interviewing or writing anything, scan the project if it exists:

```bash
# Claude should mentally simulate or ask the user to paste their tree output:
find . -type f \( -name "*.tsx" -o -name "*.ts" -o -name "package.json" \) \
  -not -path "*/node_modules/*" -not -path "*/.next/*" | head -60
```

Use the output to:
- Detect if App Router or Pages Router is in use
- Identify existing structure patterns (features/, modules/, flat, etc.)
- Spot violations of this skill's rules before proposing anything
- Pre-fill interview answers where structure makes the answer obvious

---

## Step 2 — Runtime Interview

Before writing a single file, Claude MUST ask the user these questions (adapt based on context already known and PROJECT.md if present):

### 1. Project Topology
- Is this a **standalone Next.js app** or part of a **monorepo**?
  - Monorepo → ask: Turborepo managed or manual workspaces?
  - Turborepo → use `pnpm` (required)
  - Manual monorepo → ask: npm / pnpm / yarn / bun preference
  - Standalone → ask: npm / pnpm / yarn / bun preference

### 2. Backend Strategy
Pick one — this shapes the entire API layer:
- **Supabase** — BaaS with auth, db, storage, realtime built-in
- **Next.js Route Handlers only** — no external backend service
- **Separate backend** (NestJS / Spring / Elixir / other) → ask which one
- **Hybrid BFF** — Next.js Route Handlers proxy to a separate backend

> BFF reasoning: If backend is external AND has auth/sensitive keys → always use BFF layer.
> If backend is internal/same-org with public endpoints → let Claude reason and recommend.

### 3. State Management
- **None** — React `useState`/`useReducer` only (valid for prototypes)
- **Zustand** — lightweight, recommended for most apps
- **Redux Toolkit** — only if explicitly needed for large team/enterprise

### 4. Data Fetching
Reason based on backend choice:
- Supabase → Supabase client SDK + React Server Components
- Separate backend → **TanStack Query** (client) + RSC (server)
- Next.js only → RSC + native `fetch` with revalidation

### 5. WebSocket / Real-time
Ask: "Does this app need real-time updates (chat, live dashboards, notifications)?"
- Yes → see `references/websocket.md` for directory additions
- No → skip

### 6. Auth Strategy
Decide based on backend:
- Supabase → Supabase Auth
- Next.js only → NextAuth.js / Auth.js
- Clerk → if user wants drop-in hosted auth (any backend)
- External backend → Custom JWT via middleware + httpOnly cookies

### 7. Domain & Business Context
Always ask — this populates the Domain section of PROJECT.md:
- _"Tell me about your product. What does it do, who uses it, and what are the core entities/concepts?"_
- _"Are there any specific business rules I should know? (e.g. role-based access, multi-tenancy, approval workflows, subscription tiers)"_
- _"What are the main features or modules you're planning to build?"_

Extract from user's answers:
- Core domain entities (User, Order, Workspace, etc.)
- User roles and permissions model
- Key workflows or flows (onboarding, checkout, approval chain, etc.)
- Any constraints or non-obvious rules

This is freeform — capture as much as the user shares. It lives in PROJECT.md and guides all future code decisions.

---

## Step 3 — Generate PROJECT.md

After the interview is complete, generate or update `PROJECT.md` **before writing any code**.
See `references/project-md-template.md` for the exact format.

Rules:
- Be specific — no vague placeholders like "TBD" unless truly unknown
- Domain section should read like a junior dev briefing — enough context to make decisions without asking again
- Confirm with the user: _"Here's your PROJECT.md — does this look right?"_
- Once confirmed, proceed to scaffold/code
- **Always update PROJECT.md** when new features, decisions, or domain knowledge are added in future sessions

---

## Existing Project Audit

If project already exists, run this checklist before proposing changes:

```
✅ Is App Router in use? (src/app/ directory, not pages/)
✅ Are pages thin — no business logic directly in page.tsx?
✅ Is app/ inside src/ (create-next-app default layout)?
✅ Are shared components in src/components/{ui,common,layouts}/?
✅ Is feature logic in src/features/[feature]/?
✅ Are API routes in src/app/api/ acting as BFF where needed?
✅ Is tsconfig using @/* path aliases pointing to ./src/*?
✅ Is t3-env used for environment variable validation?
✅ Is there a lib/fetch.ts thin wrapper (not axios)?
✅ Are skeletons defined per-component (not just page-level)?
```

Report which checks fail and propose a migration plan — never silently rewrite.

---

## Canonical Directory Structure

Follows the default `create-next-app` layout — everything lives inside `src/`, including `app/`.

```
my-app/
├── src/
│   ├── app/                          # Next.js App Router (THIN pages only)
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   └── [feature]/page.tsx   # Delegates to src/features/
│   │   ├── api/                      # BFF Route Handlers
│   │   │   └── [feature]/
│   │   │       └── route.ts
│   │   ├── error.tsx                 # Global error boundary
│   │   ├── not-found.tsx
│   │   ├── favicon.ico
│   │   └── layout.tsx                # Root layout (fonts, providers)
│   │
│   ├── components/               # CENTRALIZED shared components
│   │   ├── ui/                   # shadcn/ui primitives (Button, Input, Badge…)
│   │   ├── common/               # Shared composites (Navbar, Footer, Modal, PageHeader)
│   │   └── layouts/              # Layout wrappers (AppShell, AuthLayout, DashboardLayout)
│   │
│   ├── features/                 # Feature-scoped code
│   │   └── [feature-name]/
│   │       ├── components/       # Feature-specific components
│   │       │   ├── FeatureCard.tsx
│   │       │   ├── FeatureCard.skeleton.tsx   # ← always paired
│   │       │   ├── FeatureList.tsx
│   │       │   └── FeatureList.skeleton.tsx
│   │       ├── hooks/            # useFeatureData, useFeatureActions
│   │       ├── store/            # Zustand slice (if state management used)
│   │       ├── api/              # TanStack Query hooks or server actions
│   │       │   ├── queries.ts
│   │       │   └── mutations.ts
│   │       ├── types/            # Zod schemas + inferred TS types
│   │       │   └── index.ts
│   │       └── index.ts          # Barrel export
│   │
│   ├── lib/
│   │   ├── fetch.ts              # Thin fetch wrapper (see below)
│   │   ├── utils.ts              # cn() helper, misc utilities
│   │   ├── env.ts                # t3-env validated env vars
│   │   └── providers.tsx         # All React context providers composed here
│   │
│   ├── hooks/                    # Global reusable hooks (useDebounce, useMediaQuery)
│   ├── types/                    # Global shared types (ApiResponse<T>, PaginatedResponse<T>)
│   └── styles/
│       └── globals.css
│
├── public/
├── .env.local
├── .env.example
├── CLAUDE.md                     # AI assistant context (optional but recommended)
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
├── tsconfig.json
└── package.json
```

### WebSocket additions (only when real-time is needed)
See `references/websocket.md` — adds:
```
src/lib/socket.ts
src/features/[feature]/hooks/useFeatureSocket.ts
src/features/[feature]/store/socketSlice.ts (if Zustand)
```

---

## Core File Templates

### `src/lib/fetch.ts` — Thin Fetch Wrapper
```typescript
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

  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}${path}`, {
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
```

> On the server (RSC / Route Handlers), `NEXT_PUBLIC_API_URL` points to the external backend.
> On the client, Route Handler paths (`/api/...`) are used — never expose backend URLs to the browser.

---

### `src/lib/env.ts` — t3-env
```typescript
import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'production', 'test']),
    // Add: DATABASE_URL, API_SECRET_KEY, etc.
  },
  client: {
    NEXT_PUBLIC_API_URL: z.string().url(),
    // Add: NEXT_PUBLIC_SUPABASE_URL, etc.
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
})
```

---

### Skeleton Pattern — Always Co-locate
Every component that fetches data MUST have a paired `.skeleton.tsx`:

```typescript
// FeatureCard.tsx
export function FeatureCard({ item }: { item: FeatureItem }) {
  return (
    <div className="rounded-lg border p-4">
      <h3 className="font-semibold">{item.title}</h3>
      <p className="text-muted-foreground text-sm">{item.description}</p>
    </div>
  )
}

// FeatureCard.skeleton.tsx
import { Skeleton } from '@/components/ui/skeleton'

export function FeatureCardSkeleton() {
  return (
    <div className="rounded-lg border p-4 space-y-2">
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-4 w-full" />
    </div>
  )
}
```

In the page/parent — use React Suspense or conditional loading:
```typescript
// In RSC page
import { Suspense } from 'react'
import { FeatureList } from '@/features/feature/components/FeatureList'
import { FeatureListSkeleton } from '@/features/feature/components/FeatureList.skeleton'

export default function Page() {
  return (
    <Suspense fallback={<FeatureListSkeleton />}>
      <FeatureList />
    </Suspense>
  )
}
```

---

### Layered Error Handling
Three layers always present:

1. **`src/app/error.tsx`** — catches unhandled RSC/route errors globally
2. **`src/app/(group)/error.tsx`** — per-route-group boundary for isolated sections
3. **Toast layer** — client errors surfaced via `sonner` in `src/lib/providers.tsx`

```typescript
// src/lib/providers.tsx
'use client'
import { Toaster } from 'sonner'
import { QueryClientProvider } from '@tanstack/react-query' // if TanStack Query used

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  )
}
```

---

### Zustand Store Pattern (when state management is used)
One file per feature slice, composed in a root store if needed:

```typescript
// src/features/[feature]/store/index.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { FeatureItem } from '../types'

type FeatureStore = {
  items: FeatureItem[]
  selectedId: string | null
  setSelected: (id: string | null) => void
}

export const useFeatureStore = create<FeatureStore>()(
  devtools(
    (set) => ({
      items: [],
      selectedId: null,
      setSelected: (id) => set({ selectedId: id }),
    }),
    { name: 'feature-store' }
  )
)
```

---

### TypeScript — Strict with Intentional Escapes
`tsconfig.json` always includes:
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

When `any` is genuinely needed, always document why:
```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const legacyData = externalLib.getData() as any // third-party has no types
```

Never use `any` for laziness. Use `unknown` + Zod narrowing instead.

---

### Zod Types Pattern
```typescript
// src/features/[feature]/types/index.ts
import { z } from 'zod'

export const featureItemSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  status: z.enum(['active', 'inactive', 'pending']),
  createdAt: z.coerce.date(),
})

export type FeatureItem = z.infer<typeof featureItemSchema>

// Use in API layer to validate responses:
export const featureItemListSchema = z.array(featureItemSchema)
```

---

## Tooling Config

### oxlint (linting)
```json
// package.json scripts
{
  "lint": "oxlint .",
  "lint:fix": "oxlint . --fix"
}
```

### Prettier
```json
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### tsconfig paths
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## Rules Claude Must Always Follow

1. **Pages are dumb.** `src/app/**/page.tsx` only imports from `src/features/` and `src/components/`. No business logic inline.
2. **Every data-fetching component has a `.skeleton.tsx` sibling.** No exceptions.
3. **No `axios`.** Only the `lib/fetch.ts` wrapper.
4. **No bare `process.env`.** Always use `env` from `lib/env.ts`.
5. **No `any` without a comment.** Use `unknown` + Zod narrowing.
6. **Client components are the minority.** Default to RSC; add `'use client'` only when necessary (event handlers, browser APIs, hooks).
7. **Feature barrels.** Every `src/features/[feature]/` has an `index.ts` that controls public exports.
8. **Absolute imports only.** `@/features/...` not `../../features/...`.
9. **BFF by default for external backends.** Never expose backend URLs or secrets to the browser.
10. **Ask before assuming.** When backend, auth, or state choices are unclear, ask before scaffolding.

---

## Reference Files

- `references/project-md-template.md` — Template and instructions for generating PROJECT.md

- `references/websocket.md` — WebSocket/real-time directory additions and socket client setup
- `references/supabase.md` — Supabase-specific structure (auth helpers, server client, middleware)
- `references/backends.md` — BFF pattern per backend type (NestJS, Spring, Elixir, custom)
- `references/auth.md` — Auth scaffold per strategy (NextAuth, Clerk, Supabase Auth, Custom JWT)
- `references/monorepo.md` — Turborepo + pnpm workspace setup with shared packages
## Rules Claude Must Always Follow (Additions)

11. **Check for PROJECT.md first.** Every session starts by looking for it — resume if found, generate if not.
12. **Never skip the domain questions.** Even for purely structural tasks, understanding the domain improves every decision.
13. **PROJECT.md is living documentation.** Update it whenever new context is learned or decisions change.
