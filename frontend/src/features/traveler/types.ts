// ─── Shared Location & Route types ──────────────────────────────

export interface Location {
  locationId: string
  locationName: string
  latitude: number
  longitude: number
}

export interface RouteStop {
  routeStopId: string
  routeId: string
  locationId: string
  locationName: string
  sequenceOrder: number
  distanceFromOrigin: number
  boardingPoint: boolean
  droppingPoint: boolean
}

export interface Route {
  routeId: string
  routeName: string
  ownerId: string
  stops: RouteStop[]
  createdAt: string
}

// ─── Trip types ─────────────────────────────────────────────────

export interface TripSearchResult {
  tripId: string
  busId: string
  busRegistrationNumber: string
  routeId: string
  routeName: string
  driverId: string
  departureTime: string
  expectedDurationMin: number
  availableSeats: number
  estimatedPrice: number
  status: 'SCHEDULED' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELED'
  seatsGenerated: number
  createdAt: string
}

export interface PageResponse<T> {
  content: T[]
  totalPages: number
  totalElements: number
  size: number
  number: number
  first: boolean
  last: boolean
  numberOfElements: number
  empty: boolean
}

// ─── Seat types ─────────────────────────────────────────────────

export interface BookedSegmentInfo {
  boardingSeq: number
  dropoffSeq: number
  boardingStopName: string
  dropoffStopName: string
}

export interface TripSeat {
  tripId: string
  tripSeatId: string
  seatNumber: string
  seatStatus: 'AVAILABLE' | 'BOOKED' | 'PARTIALLY_BOOKED'
  bookedSegments: BookedSegmentInfo[]
}

// ─── Booking types ──────────────────────────────────────────────

export interface BookingRequest {
  tripId: string
  tripSeatId: string
  boardingStopId: string
  dropoffStopId: string
}

export interface Booking {
  bookingId: string
  tripId: string
  userId: string
  tripSeatId: string
  seatNumber: string
  boardingStopName: string
  dropoffStopName: string
  boardingSeq: number
  dropoffSeq: number
  totalPrice: number
  bookingCode: string
  qrCodePath: string
  ticketPdfPath: string
  didBoard: boolean
  status: 'CONFIRMED' | 'CANCELED'
  bookedAt: string
}

// ─── Bus types (for seat layout rendering) ──────────────────────

export interface SeatLayoutConfig {
  seatType: string
  rows: number
  leftCols: string[]
  rightCols: string[]
}

export interface Bus {
  busId: string
  registrationNumber: string
  vehicleNumber: string
  pricePerKm: number
  seatLayout: SeatLayoutConfig
  status: 'ACTIVE' | 'MAINTENANCE'
  ownerId: string
  ownerEmail: string
  createdAt: string
  updatedAt: string
}

// ─── Segment Search params ──────────────────────────────────────

export interface SegmentSearchParams {
  originLocationId: string
  destinationLocationId: string
  date: string
  originName?: string
  destinationName?: string
}

// ─── API Response wrapper ──────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}
