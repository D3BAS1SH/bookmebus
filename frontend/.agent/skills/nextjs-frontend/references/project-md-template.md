# PROJECT.md — Template & Generation Instructions

## When to read this file
Read when generating or updating `PROJECT.md` after the runtime interview.

## How to Generate

Fill every field from interview answers. Be specific and concrete.
Do NOT leave fields as "TBD" unless the user explicitly said they haven't decided.
Write the Domain section as if briefing a new developer joining the team.

After generating, show it to the user and ask: _"Does this look right before I start writing code?"_
Incorporate any corrections, then proceed.

---

## PROJECT.md Template

```markdown
# PROJECT.md
> Single source of truth for architecture decisions and domain context.
> Update this file whenever decisions change or new domain knowledge is added.
> Last updated: [DATE]

---

## 1. Project Overview

| Field | Value |
|-------|-------|
| **App Name** | [name] |
| **Description** | [one sentence — what it does and who uses it] |
| **Next.js Version** | Latest stable |
| **Topology** | [Standalone / Turborepo monorepo / Manual monorepo] |
| **Package Manager** | [pnpm / npm / yarn / bun] |
| **Deployment** | Vercel |

---

## 2. Architecture Decisions

### Backend
| Field | Value |
|-------|-------|
| **Strategy** | [Supabase / Next.js Route Handlers only / External backend / Hybrid BFF] |
| **Backend Service** | [NestJS on :3001 / Spring Boot on :8080 / Elixir Phoenix on :4000 / N/A] |
| **BFF Layer** | [Yes — all external calls go through app/api/ / No — RSC calls backend directly] |
| **API Base URL (dev)** | [http://localhost:3001 / N/A] |

### Auth
| Field | Value |
|-------|-------|
| **Strategy** | [Supabase Auth / NextAuth.js v5 / Clerk / Custom JWT] |
| **Session storage** | [httpOnly cookie / Supabase session / Clerk managed] |
| **Protected routes** | [middleware.ts guards all routes except /login, /register] |

### State Management
| Field | Value |
|-------|-------|
| **Choice** | [None — React state only / Zustand / Redux Toolkit] |
| **Reasoning** | [e.g. Prototype stage, Zustand for shared UI state only] |

### Data Fetching
| Field | Value |
|-------|-------|
| **Server (RSC)** | [Native fetch with revalidation / Supabase server client] |
| **Client** | [TanStack Query → BFF endpoints / Supabase client SDK / None] |

### Real-time / WebSocket
| Field | Value |
|-------|-------|
| **Enabled** | [Yes / No] |
| **Method** | [Socket.io via lib/socket.ts / Supabase Realtime / N/A] |
| **Features using it** | [notifications, chat, live-feed / N/A] |

### UI & Styling
| Field | Value |
|-------|-------|
| **Stack** | Tailwind CSS + shadcn/ui |
| **Linting** | oxlint + Prettier + prettier-plugin-tailwindcss |
| **Component layers** | src/components/ui, src/components/common, src/components/layouts |

### TypeScript
| Field | Value |
|-------|-------|
| **Strictness** | strict: true, noUncheckedIndexedAccess, exactOptionalPropertyTypes |
| **any policy** | Allowed only with inline comment explaining why |

---

## 3. Directory Conventions

- **Pages** — thin, delegate to `src/features/`. No business logic in `app/**/page.tsx`
- **Features** — `src/features/[name]/{components,hooks,store,api,types}/`
- **Shared components** — `src/components/{ui,common,layouts}/`
- **API client** — `src/lib/fetch.ts` thin wrapper only, no axios
- **Env vars** — always via `src/lib/env.ts` (t3-env + Zod), never bare `process.env`
- **Imports** — absolute only via `@/*` tsconfig paths
- **Skeletons** — every data-fetching component has a `.skeleton.tsx` sibling

---

## 4. Domain Context

### What This App Does
[2–4 sentences. What problem does it solve? Who are the users?]

### Core Entities
List the main data models/concepts in this domain:

| Entity | Description |
|--------|-------------|
| [User] | [e.g. Authenticated person. Has a role: admin or member.] |
| [Workspace] | [e.g. Top-level tenant container. Users belong to one workspace.] |
| [Project] | [e.g. Created inside a workspace. Has status: draft, active, archived.] |
| ... | ... |

### User Roles & Permissions
[Describe who can do what. e.g.:]
- **Admin** — full CRUD on all workspace resources, can invite/remove members
- **Member** — read + create own projects, cannot access billing or settings
- **Guest** — read-only, no create/edit

### Key Workflows
Describe the important flows in the product:

1. **[Onboarding]** — [User signs up → creates workspace → invited teammates → lands on dashboard]
2. **[Core workflow]** — [e.g. User creates project → adds tasks → assigns members → marks complete]
3. **[Other notable flow]** — [...]

### Business Rules
Non-obvious constraints that affect code decisions:
- [e.g. A user can belong to only one workspace at a time]
- [e.g. Projects cannot be deleted, only archived]
- [e.g. Free tier is limited to 3 active projects — enforce client-side and server-side]
- [e.g. All timestamps are stored as UTC, displayed in user's local timezone]

### Planned Features / Modules
Features planned for this project (drives `src/features/` structure):
- [ ] [auth] — login, register, password reset
- [ ] [dashboard] — overview stats, recent activity
- [ ] [projects] — CRUD, status management
- [ ] [team] — invite, roles, member list
- [ ] [billing] — subscription plans, usage limits
- [ ] [notifications] — in-app + real-time alerts

---

## 5. Environment Variables

| Variable | Where | Purpose |
|----------|-------|---------|
| `NODE_ENV` | server | Runtime environment |
| `NEXT_PUBLIC_API_URL` | client | Backend base URL |
| `[AUTH_SECRET]` | server | [NextAuth / JWT signing key] |
| `[NEXT_PUBLIC_SUPABASE_URL]` | client | [If Supabase] |
| `[NEXT_PUBLIC_SUPABASE_ANON_KEY]` | client | [If Supabase] |

---

## 6. Change Log
> Track significant architectural decisions and when they were made.

| Date | Decision | Reason |
|------|----------|--------|
| [DATE] | Initial architecture established | Project kickoff |
```

---

## Update Instructions

When updating an existing PROJECT.md:
- Update the `Last updated` date
- Add a row to the Change Log table
- Only modify the specific fields that changed — don't regenerate the whole file
- If a new entity or business rule is discovered, add it to Section 4 immediately
- If a new feature module is planned, add it to the Planned Features checklist
