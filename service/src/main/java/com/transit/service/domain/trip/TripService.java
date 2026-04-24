package com.transit.service.domain.trip;

import com.transit.service.domain.trip.dto.TripRequest;
import com.transit.service.domain.trip.dto.TripResponse;
import com.transit.service.domain.trip.dto.TripSeatResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface TripService {
    TripResponse createTrip(TripRequest request, UUID callerUserId);
    TripResponse getTripById(UUID tripId);

    // Queries
    Page<TripResponse> searchTrips(UUID routeId, LocalDate date, Pageable pageable);

    // Owner operations
    TripResponse updateTrip(UUID tripId, TripRequest request, UUID callerUserId);
    Page<TripResponse> getTripsByOwner(UUID ownerId, Pageable pageable);
    void cancelTrip(UUID tripId, UUID callerUserId);
    void deleteTrip(UUID tripId, UUID callerUserId);

    // Driver operations — Phase 5
    Page<TripResponse> getTripsByDriver(UUID driverId, Pageable pageable);
    TripResponse startTrip(UUID tripId, UUID driverUserId);
    TripResponse completeTrip(UUID tripId, UUID driverUserId);

    // Seat queries — used by booking in Phase 3 Part 2
//    List<TripSeatResponse> getAvailableSeats(UUID tripId);

    /**
     * Returns all seats for a trip with live availability status.
     *
     * Two modes depending on whether segment params are provided:
     *
     * Segment mode — boardingStopId + dropoffStopId both present:
     *   Each seat is marked AVAILABLE or BOOKED for that specific segment.
     *   Intended for travelers searching seats before booking.
     *
     * General mode — either param is null:
     *   Each seat is marked AVAILABLE or PARTIALLY_BOOKED based on whether
     *   any confirmed booking exists anywhere on the route for that seat.
     *   bookedSegments list is populated with stop names.
     *   Intended for owner/driver occupancy dashboards.
     *
     * @param tripId         the trip to query seats for
     * @param boardingLocationId optional — location UUID of the boarding stop
     * @param dropoffLocationId  optional — location UUID of the dropoff stop
     */
    List<TripSeatResponse> getAvailableSeats(UUID tripId, UUID boardingLocationId, UUID dropoffLocationId);

    Page<TripResponse> searchTripsBySegment(
            UUID originLocationId,
            UUID destinationLocationId,
            LocalDate date,
            Pageable pageable
    );
}
