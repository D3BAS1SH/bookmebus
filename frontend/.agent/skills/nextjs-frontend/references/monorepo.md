# Monorepo Reference

## When to read this file
Read when user chooses **Turborepo** or **manual monorepo** topology.

## Package Manager Decision

| Topology | Package Manager |
|----------|----------------|
| Turborepo | **pnpm** (required — workspaces + caching) |
| Manual monorepo | Ask user: pnpm / yarn / npm |
| Standalone | Ask user: pnpm / npm / yarn / bun |

---

## Turborepo Structure

```
my-monorepo/
├── apps/
│   ├── web/                  # Next.js frontend (this skill's domain)
│   └── api/                  # Backend (NestJS / other)
├── packages/
│   ├── ui/                   # Shared shadcn/ui components
│   ├── types/                # Shared Zod schemas + TypeScript types
│   ├── config/
│   │   ├── eslint/
│   │   └── typescript/
│   └── utils/                # Shared utility functions
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## `pnpm-workspace.yaml`
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

## `turbo.json`
```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "type-check": {}
  }
}
```

## Shared `packages/types` pattern
```typescript
// packages/types/src/feature.ts
import { z } from 'zod'

export const featureItemSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
})
export type FeatureItem = z.infer<typeof featureItemSchema>
```

Import in Next.js app:
```typescript
import type { FeatureItem } from '@repo/types'
```

## Shared `packages/ui` (shadcn components)
When using Turborepo, shadcn/ui components can live in `packages/ui` and be shared across apps.

```bash
# Install shadcn into the shared ui package
pnpm --filter @repo/ui dlx shadcn@latest init
```

## Dev command
```bash
pnpm turbo dev         # Runs all apps in parallel
pnpm turbo dev --filter=web  # Runs only Next.js app
```

---

## Manual Monorepo (no Turborepo)

```
my-monorepo/
├── frontend/          # Next.js app
├── backend/           # Any backend
├── shared/            # Manually managed shared code
└── package.json       # Root workspace definition (npm/yarn/pnpm)
```

Import shared code via relative paths or workspace aliases — no Turbo pipeline.
Claude should suggest migrating to Turborepo if the project grows beyond 2 apps.
