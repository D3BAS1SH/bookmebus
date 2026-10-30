# Plan 3: Route & Location Management

## 1. Objective
Establish the geographical foundation for all travel services by defining high-frequency stations and connecting them into logical travel routes.

## 2. Pages (App Router)
Located in `src/app/(owner)/owner/`:
- **`/locations`**: Inventory of boarding stations and bus stops.
- **`/routes`**: List of all defined routes (e.g., Phnom Penh ↔ Siem Reap).
- **`/routes/new`**: Interactive builder for creating new path sequences.

## 3. Feature Components (`src/features/routes/components`)
- **`LocationGrid.tsx`**: Management interface for adding/editing stations.
- **`RouteBuilder.tsx`**: A visual "drag-and-drop" or "stepper" interface to sequence locations into a route.
- **`StopTimeline.tsx`**: A vertical timeline showing stop order and estimated offset times.
- **`LocationCombobox.tsx`**: Reusable station selector with fuzzy search.
- **`RouteOverviewCard.tsx`**: Summarizes route metadata (Distance, Estimated Duration, Stop Count).

## 4. State Management
- **Zustand (`src/features/routes/store/builderStore.ts`)**:
  - `activeStops`: Temporary list of stops being sequenced in the builder.
  - `actions`: `addStop`, `removeStop`, `reorderStops`, `clearBuilder`.
- **TanStack Query**:
  - `useLocations()`: Global station list.
  - `useRoutes()`: Current owner's route list.

## 5. BFF Implementation (`src/app/api/`)
- **Route Handlers**:
  - `GET /api/locations`: Proxies to `/api/v1/location`.
  - `POST /api/locations`: Creating new nodes in the system.
  - `POST /api/routes`: Creating the route header and stops as a single transaction (orchestrated in Next.js if needed).

## 6. Logic & Types
- **`types/index.ts`**: `Route`, `Location`, `RouteStop`, `CreateRouteDTO`.
- **Logic**: Validation to ensure a route has at least an origin and a destination stop.

## 7. Verification Plan
- [ ] Ensure locations created are immediate selections in the route builder.
- [ ] Verify that deleting a stop in the builder correctly updates the sequence order.
- [ ] Validate route logic preventing self-referencing (Origin cannot be same as Destination).

