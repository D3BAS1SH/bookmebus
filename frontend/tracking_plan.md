# Plan 6: Real-time Tracking

## 1. Objective
Provide a premium, high-confidence tracking experience. Drivers emit their location synchronized with their trip context, and travelers view progress on a live map.

## 2. Pages (App Router)
- **`/(traveler)/traveler/tracking/[tripId]`**: The live map view for a specific booked journey.
- **`/(driver)/driver/trip/[id]/active`**: The driver's cockpit, showing maps and "Emit Location" status.

## 3. Feature Components (`src/features/tracking/components`)
- **`LiveMapView.tsx`**: Integrated Mapbox/Google Maps component with custom markers.
- **`BusMarker.tsx`**: Animated icon that rotates based on heading/bearing.
- **`LocationTransmitter.tsx`**: Background-aware component (for Driver) that hooks into Geolocation API.
- **`ETAWidget.tsx`**: Real-time arrival calculation based on current speed and distance to destination.
- **`TrackingStatusIndicator.tsx`**: "Live", "Delayed", or "Offline" status for the traveler.

## 4. State Management
- **Zustand (`src/features/tracking/store/trackingStore.ts`)**:
  - `currentCoords`: `{ lat, lng, speed, bearing }`.
  - `history`: Last 5 points (for smooth interpolation).
  - `actions`: `updateLocation`, `resetTracking`.
- **Hooks**:
  - `useLocationStream()`: Handles the logic of `setInterval` vs WebSocket connection.

## 5. BFF Implementation (`src/app/api/`)
- **Route Handlers**:
  - `POST /api/tracking/emit`: Receives coords from Driver → Proxies to Spring `/api/v1/trips/{id}/location`.
  - `GET /api/tracking/stream/[id]`: A Server-Sent Events (SSE) or Fetch-based proxy to provide live updates to Travelers.

## 6. Logic & Types
- **`types/index.ts`**: `LocationUpdate`, `TripTrackingContext`.
- **Logic**: Throttling (emit only every 10-15 seconds to save battery) and smooth marker interpolation on the client.

## 7. Verification Plan
- [ ] Test "Transmitter" logic while moving (using browser geolocation simulator).
- [ ] Verify "Marker" stays centered or follows the route path on the traveler's side.
- [ ] Confirm "Offline" warning triggers if no update is received for >60 seconds.

