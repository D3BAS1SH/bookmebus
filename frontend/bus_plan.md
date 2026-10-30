# Plan 2: Bus & Fleet Management

## 1. Objective
Enable Fleet Owners to manage their assets efficiently. This includes adding new vehicles, monitoring operational status, and maintaining technical specifications.

## 2. Pages (App Router)
Located in `src/app/(owner)/owner/`:
- **`/buses`**: Dashboard overview of the entire fleet.
- **`/buses/new`**: Form specifically for fleet expansion.
- **`/buses/[id]`**: Detailed view for a single bus (maintenance history, active trips).

## 3. Feature Components (`src/features/fleet/components`)
- **`BusTable.tsx`**: A searchable, sortable TanStack Table showing plate number, model, capacity, and current status.
- **`BusForm.tsx`**: A sliding sheet or modal for adding/editing bus details with Zod-backed validation.
- **`StatusBadge.tsx`**: Semantic visual indicator (Active, Maintenance, Retired).
- **`BusCard.tsx`**: Summary view for mobile/grid layouts.
- **`FleetStats.tsx`**: Dashboard widgets showing "Active Buses" vs "Total Capacity".

## 4. State Management
- **Local State (`React Hook Form`)**: For managing form inputs and validation.
- **TanStack Query (`src/features/fleet/api`)**:
  - `useBuses()`: Fetches the fleet for the current owner.
  - `useBus(id)`: Fetches details for a specific bus.
  - `useUpdateBusStatus()`: Optimistic mutation for status toggles.

## 5. BFF Implementation (`src/app/api/buses`)
- **Route Handlers**:
  - `GET /api/buses`: Proxies to Spring `/api/v1/buses/owner` (context-aware listing).
  - `POST /api/buses`: Proxies to `/api/v1/buses` with owner context injection.
  - `PATCH /api/buses/[id]/status`: Specialized endpoint for quick status updates.

## 6. Logic & Types
- **`types/index.ts`**: `Bus`, `BusStatus`, `BusCapacity`, `CreateBusDTO`.
- **`utils/status.ts`**: Helper for mapping backend status strings to UI colors and labels.

## 7. Verification Plan
- [ ] Verify only users with the `OWNER` role can view these pages.
- [ ] Test optimistic UI updates when toggling bus status (e.g., marking for maintenance).
- [ ] Confirm form validation prevents invalid capacity or duplicate plate numbers.

