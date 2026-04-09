# PROJECT.md
> Single source of truth for architecture decisions and domain context.
> Update this file whenever decisions change or new domain knowledge is added.
> Last updated: 2026-04-09

---

## 1. Project Overview

| Field | Value |
|-------|-------|
| **App Name** | bookmebus |
| **Description** | A role-based booking and real-time tracking platform for buses, catering to Owners, Drivers, and Travellers. |
| **Next.js Version** | 16.2.2 |
| **Topology** | Standalone |
| **Package Manager** | npm |
| **Deployment** | Vercel (recommended) |

---

## 2. Architecture Decisions

### Backend
| Field | Value |
|-------|-------|
| **Strategy** | Hybrid BFF |
| **Backend Service** | Spring Boot (External) |
| **BFF Layer** | Yes — all external calls go through `app/api/` and manage cookies |
| **API Base URL (dev)** | http://localhost:8080 (assumed for Spring Boot) |

### Auth
| Field | Value |
|-------|-------|
| **Strategy** | Custom JWT from Spring Backend |
| **Session storage** | httpOnly cookies (managed by Next.js Route Handlers) |
| **Protected routes** | `middleware.ts` guards based on JWT existence and role requirements |

### State Management
| Field | Value |
|-------|-------|
| **Choice** | Zustand |
| **Reasoning** | Lightweight and shared UI state needed for real-time tracking coordination. |

### Data Fetching
| Field | Value |
|-------|-------|
| **Server (RSC)** | Native fetch with revalidation (direct to Spring or through local proxy) |
| **Client** | TanStack Query → BFF endpoints |

### Real-time / WebSocket
| Field | Value |
|-------|-------|
| **Enabled** | Yes |
| **Method** | Socket.io or native WebSockets via `lib/socket.ts` |
| **Features using it** | Real-time vehicle position, status updates, and ETA notifications |

### UI & Styling
| Field | Value |
|-------|-------|
| **Stack** | Tailwind CSS 4 + shadcn/ui |
| **Linting** | eslint + Prettier + prettier-plugin-tailwindcss |
| **Component layers** | `src/components/ui`, `src/components/common`, `src/components/layouts` |

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
BookMeBus is a platform that connects bus owners, drivers, and travellers. It solves the problem of uncertain bus arrivals and manual seat booking by providing a real-time tracking system and a digital booking interface.

### Core Entities

| Entity | Description |
|--------|-------------|
| **User** | Authenticated person with a role: Owner, Driver, or Traveller. |
| **Bus** | A vehicle equipped with GPS tracking capabilities. |
| **Route** | A predefined path with boarding and destination points. |
| **Seat** | A bookable unit on a Bus for a specific Journey. |
| **Booking** | A traveller's reservation for one or more seats on a Bus. |
| **Ticket** | The digital proof of booking, used for boarding verification. |
| **Tracking** | Real-time coordinates and status (moving, halted, delayed) of a Bus. |

### User Roles & Permissions
- **Owner** — Fleet overview: monitor all buses, seat occupancy, analytics, and business health.
- **Driver** — Operational: emit real-time location, verify traveller boarding (check-in), and report delays.
- **Traveller** — Consumer: search routes, book seats, pay, and track bus real-time location/ETA.

### Key Workflows

1. **[Booking Flow]** — Traveller searches routes → selects seat → pays → receives digital ticket.
2. **[Real-time Tracking]** — Driver starts trip → emits GPS location via WebSocket → Traveller views real-time position on map with ETA.
3. **[Boarding Verification]** — Bus arrives at boarding point → Traveller presents ticket → Driver verifies boarding in the app.
4. **[Owner Monitoring]** — Owner accesses dashboard to see all active buses, their locations, and occupancy rates.

### Business Rules
- **Role-based Access**: Specific features (Driver verification, Owner analytics) are restricted by role.
- **Real-time Dependency**: Vehicle tracking requires an active WebSocket connection from the driver.
- **BFF Authentication**: The frontend manages JWT via secure browser cookies to prevent XSS.
- **Seat Exclusivity**: A seat cannot be double-booked for the same journey session.

### Planned Features / Modules
- [ ] `[auth]` — login, signup, forgot password (Custom JWT)
- [ ] `[search]` — route search for boarding/destination
- [ ] `[booking]` — seat selection and reservation logic
- [ ] `[payment]` — traveller payment integration
- [ ] `[tracking]` — real-time WebSocket vehicle position (map view)
- [ ] `[driver]` — driver-specific actions (location emission, boarding verification)
- [ ] `[owner]` — owner dashboard (monitoring, analytics)

---

## 5. Environment Variables

| Variable | Where | Purpose |
|----------|-------|---------|
| `NODE_ENV` | server | Runtime environment |
| `NEXT_PUBLIC_API_URL` | client | Backend base URL (Spring Boot) |
| `JWT_SECRET` | server | (If needed by BFF, though usually Spring handles signing) |

---

## 6. Change Log

| Date | Decision | Reason |
|------|----------|--------|
| 2026-04-09 | Initial architecture established | Project kickoff with Hybrid BFF (Spring Boot) |
