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
    List<TripSeatResponse> getAvailableSeats(UUID tripId);
}
