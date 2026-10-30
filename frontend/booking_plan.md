# Plan 5: Booking & Ticketing

## 1. Objective
Streamline the conversion from "Trip Browser" to "Confirmed Passenger". Handle seat selection flow, ticketing, and check-in.

## 2. Pages (App Router)
- **`/(traveler)/traveler/trips/[id]/book`**: The seat selection and checkout page.
- **`/(traveler)/traveler/bookings`**: History of current and past tickets.
- **`/(driver)/driver/check-in`**: Operational page for verifying passenger boarding.

## 3. Feature Components (`src/features/bookings/components`)
- **`SeatMap.tsx`**: Interactive SVG layout representing the bus interior. Allows selection/deselection with multi-select support.
- **`BookingSummary.tsx`**: Sticky card showing selected seats and total calculated price.
- **`TicketCard.tsx`**: Premium digital ticket with a dynamically generated QR code (for check-in).
- **`BoardingList.tsx`**: Driver's view of all passengers for a trip, with single-click check-in buttons.
- **`Scanner.tsx`**: Camera-integrated component (if mobile) to scan and resolve traveler tickets.

## 4. State Management
- **Zustand (`src/features/bookings/store/bookingStore.ts`)**:
  - `selectedSeats`: Array of IDs.
  - `provisionalBooking`: Temporary data before payment.
  - `actions`: `selectSeat`, `deselectSeat`, `resetBooking`.
- **TanStack Query**:
  - `useTripSeats(tripId)`: Live seat availability (critical to prevent race conditions).
  - `useCreateBooking()`: Mutation to finalize the transaction.
  - `useBoardPassenger()`: Driver-side mutation to update passenger status.

## 5. BFF Implementation (`src/app/api/`)
- **Route Handlers**:
  - `POST /api/bookings`: Validates seat availability one last time before calling Spring `/api/v1/bookings`.
  - `GET /api/bookings/my`: Fetches traveler-specific history.
  - `PATCH /api/bookings/[id]/board`: Specialized proxy for the boarding action.

## 6. Logic & Types
- **`types/index.ts`**: `Booking`, `SeatStatus`, `TicketPayload`.
- **Logic**: Seat locking logic (if supported by backend) or simple immediate reservation.

## 7. Verification Plan
- [ ] Test the "Select Seat" interaction to ensure visual feedback is immediate.
- [ ] Verify that already booked seats (fetched from API) are disabled and unclickable.
- [ ] Confirm QR codes generated for tickets resolve correctly to the passenger's data.

