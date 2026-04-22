package com.transit.service.domain.trip.dto;

/**
 * Availability status of a TripSeat for a given boarding→dropoff segment.
 *
 * AVAILABLE — no confirmed booking overlaps the requested segment.
 *             Traveler can book this seat.
 *
 * BOOKED     — at least one confirmed booking overlaps the requested segment.
 *             Traveler cannot book this seat for the requested journey.
 *
 * PARTIALLY_BOOKED — returned only in general (no-segment) mode.
 *             The seat has at least one confirmed booking somewhere on the route,
 *             but may still be available for specific segments.
 *             Used for owner/driver occupancy dashboards.
 */
public enum SeatStatus {
    AVAILABLE,
    BOOKED,
    PARTIALLY_BOOKED
}
