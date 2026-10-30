# Plan 4: Trip Management & Operations

## 1. Objective
Connect buses, routes, and schedules into active "Trips". Provide discovery for travelers and operational interfaces for drivers.

## 2. Pages (App Router)
- **`/(traveler)/traveler/search`**: The main trip discovery hub.
- **`/(driver)/driver/dashboard`**: Daily agenda and active trip controls.
- **`/(owner)/owner/trips`**: Scheduling grid and assignment management.

## 3. Feature Components (`src/features/trips/components`)
- **`TripSearchBar.tsx`**: Premium, animated bar with "From", "To", and "Date" selection.
- **`TripResultList.tsx`**: Dynamic list with sorting (Earliest, Cheapest) and pagination.
- **`TripCard.tsx`**: Comprehensive view showing Departure/Arrival times, Bus Class, and price.
- **`DriverAgenda.tsx`**: List of upcoming trips for the Driver.
- **`TripLifecycleControls.tsx`**: Prominent "Start Trip" and "Finish Trip" buttons for the Driver.
- **`TripSchedulingForm.tsx`**: Form to map a Bus to a Route on a specific Schedule.

## 4. State Management
- **Zustand (`src/features/trips/store/searchStore.ts`)**:
  - `filters`: Origin, Destination, Date, Price Range.
  - `actions`: `updateFilters`, `resetSearch`.
- **TanStack Query**:
  - `useSearchTrips(filters)`: Live results based on traveler input.
  - `useDriverAgenda()`: Focused list for the active driver.
  - `useTripActions()`: Specifically for status transitions (Scheduled → Active).

## 5. BFF Implementation (`src/app/api/trips`)
- **Route Handlers**:
  - `GET /api/trips/search`: Aggregates route, location, and bus data from the backend into a clean `TripResponse`.
  - `PATCH /api/trips/[id]/start`: Driver triggers journey start (updates status and potentially starts tracking stream).
  - `GET /api/trips/owner`: Fleet-wide trip overview.

## 6. Logic & Types
- **`types/index.ts`**: `Trip`, `TripSearchCriteria`, `TripStatus`.
- **Logic**: Time-based filtering (don't show past trips in search).

## 7. Verification Plan
- [ ] Verify search results update instantly when filters change.
- [ ] Test Driver role restrictions (only allow starting "today's" trips).
- [ ] Ensure "Active" trips are moved to the top of the Driver's dashboard.

