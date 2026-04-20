package com.transit.service.domain.trip;

import com.transit.service.domain.bus.Bus;
import com.transit.service.domain.bus.BusRepository;
import com.transit.service.domain.bus.SeatLayoutGenerator;
import com.transit.service.domain.route.Route;
import com.transit.service.domain.route.RouteRepository;
import com.transit.service.domain.trip.dto.TripRequest;
import com.transit.service.domain.trip.dto.TripResponse;
import com.transit.service.domain.trip.dto.TripSeatResponse;
import com.transit.service.domain.user.User;
import com.transit.service.domain.user.UserRepository;
import com.transit.service.domain.user.UserRole;
import com.transit.service.shared.exception.BusinessException;
import com.transit.service.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class TripServiceImpl implements TripService {
    private final TripRepository tripRepository;
    private final TripSeatRepository tripSeatRepository;
    private final BusRepository busRepository;
    private final RouteRepository routeRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public TripResponse createTrip(TripRequest request, UUID callerUserId) {

        Bus bus = busRepository.findById(request.getBusId())
                .orElseThrow(() -> new ResourceNotFoundException("Bus","Id",request.getBusId()));

        if (!bus.getOwner().getId().equals(callerUserId))
            throw new AccessDeniedException("Bus does not belong to you");

        Route route = routeRepository.findById(request.getRouteId())
                .orElseThrow(() -> new ResourceNotFoundException("Route","Id",request.getRouteId()));

        User driver = userRepository.findById(request.getDriverId())
                .orElseThrow(() -> new ResourceNotFoundException("Driver-user","Id",request.getDriverId()));

        if (!driver.getRole().equals(UserRole.DRIVER))
            throw new IllegalArgumentException("Assigned user is not a driver");

        Trip trip = Trip.builder()
                .bus(bus)
                .route(route)
                .driver(driver)
                .departureTime(request.getDepartureTime())
                .expectedDurationMin(request.getExpectedDurationMin())
                .status(TripStatus.SCHEDULED)
                .build();

        Trip savedTrip = tripRepository.save(trip);

        List<String> seatNames = SeatLayoutGenerator.generate(bus.getSeatLayout());
        List<TripSeat> seats = seatNames.stream()
                .map(name -> TripSeat.builder()
                        .trip(savedTrip)
                        .seatNumber(name)
                        .version(0)
                        .build())
                .toList();

        tripSeatRepository.saveAll(seats);

        log.info("Trip created: tripId={} seats={} busId={} driverId={}",
                trip.getTripId(), seats.size(), bus.getId(), driver.getId());

        return toResponse(trip, seats.size());
    }

    // -------------------------------------------------------------------------
    // Queries
    // -------------------------------------------------------------------------

    @Override
    @Transactional(readOnly = true)
    public TripResponse getTripById(UUID tripId) {
        Trip trip = findTripOrThrow(tripId);
        return toResponse(trip, tripSeatRepository.countByTrip(trip));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TripResponse> searchTrips(UUID routeId, LocalDate date, Pageable pageable) {
        Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new ResourceNotFoundException("Route","Id", routeId));

        return tripRepository.searchByRouteAndDate(routeId, date, pageable)
                .map(trip -> toResponse(trip, tripSeatRepository.countByTrip(trip)));
    }

    @Override
    @Transactional
    public TripResponse updateTrip(UUID tripId, TripRequest request, UUID callerUserId) {
        Trip trip = findTripOrThrow(tripId);

        validateOwnership(trip, callerUserId);

        if (!trip.getStatus().equals(TripStatus.SCHEDULED)) {
            throw new BusinessException("Only SCHEDULED trips can be updated");
        }

        Bus bus = busRepository.findById(request.getBusId())
                .orElseThrow(() -> new ResourceNotFoundException("Bus","Id",request.getBusId()));

        Route route = routeRepository.findById(request.getRouteId())
                .orElseThrow(() -> new ResourceNotFoundException("Route","Id",request.getRouteId()));

        User driver = userRepository.findById(request.getDriverId())
                .orElseThrow(() -> new ResourceNotFoundException("Driver","Id",request.getDriverId()));

        if (!driver.getRole().equals(UserRole.DRIVER)){
            throw new BusinessException("Assigned user is not a driver");
        }

        trip.setBus(bus);
        trip.setRoute(route);
        trip.setDriver(driver);
        trip.setDepartureTime(request.getDepartureTime());
        trip.setExpectedDurationMin(request.getExpectedDurationMin());

        Trip savedTrip = tripRepository.save(trip);

        log.info("Trip updated: tripId={}", tripId);
        return toResponse(savedTrip, tripSeatRepository.countByTrip(savedTrip));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TripResponse> getTripsByOwner(UUID ownerId, Pageable pageable) {
        if(!this.userRepository.existsById(ownerId)){
            throw new ResourceNotFoundException("Owner","Id",ownerId);
        }
        return tripRepository.findByOwnerId(ownerId, pageable)
                .map(trip -> toResponse(trip, tripSeatRepository.countByTrip(trip)));
    }

    @Override
    @Transactional
    public void cancelTrip(UUID tripId, UUID callerUserId) {
        Trip trip = findTripOrThrow(tripId);

        validateOwnership(trip, callerUserId);

        if (trip.getStatus().equals(TripStatus.COMPLETED))
            throw new BusinessException("Cannot cancel a completed trip");

        if (trip.getStatus().equals(TripStatus.CANCELLED))
            throw new BusinessException("Trip is already canceled");

        trip.setStatus(TripStatus.CANCELLED);
        tripRepository.save(trip);

        log.info("Trip canceled: tripId={}", tripId);
        // Phase 4 — trigger booking cancellation notifications here
    }

    @Override
    @Transactional
    public void deleteTrip(UUID tripId, UUID callerUserId) {
        Trip trip = findTripOrThrow(tripId);

        validateOwnership(trip, callerUserId);

        if (!trip.getStatus().equals(TripStatus.SCHEDULED))
            throw new BusinessException("Only SCHEDULED trips can be deleted");

        tripRepository.delete(trip);
        log.info("Trip deleted: tripId={}", tripId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TripResponse> getTripsByDriver(UUID driverId, Pageable pageable) {
        User driver = userRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver","Id", driverId));
        return tripRepository.findByDriver(driver, pageable)
                .map(trip -> toResponse(trip, tripSeatRepository.countByTrip(trip)));
    }

    @Override
    @Transactional
    public TripResponse startTrip(UUID tripId, UUID driverUserId) {
        Trip trip = findTripOrThrow(tripId);

        if (!trip.getDriver().getId().equals(driverUserId))
            throw new AccessDeniedException("You are not the assigned driver for this trip");

        if (!trip.getStatus().equals(TripStatus.SCHEDULED))
            throw new BusinessException("Only SCHEDULED trips can be started");

        trip.setStatus(TripStatus.IN_TRANSIT);
        Trip savedTrip = tripRepository.save(trip);

        log.info("Trip started: tripId={}", tripId);
        return toResponse(savedTrip, tripSeatRepository.countByTrip(savedTrip));
    }

    @Override
    @Transactional
    public TripResponse completeTrip(UUID tripId, UUID driverUserId) {
        Trip trip = findTripOrThrow(tripId);

        if (!trip.getDriver().getId().equals(driverUserId))
            throw new AccessDeniedException("You are not the assigned driver for this trip");

        if (!trip.getStatus().equals(TripStatus.IN_TRANSIT))
            throw new BusinessException("Only IN_TRANSIT trips can be completed");

        trip.setStatus(TripStatus.COMPLETED);
        Trip savedTrip = tripRepository.save(trip);

        log.info("Trip completed: tripId={}", tripId);
        return toResponse(savedTrip, tripSeatRepository.countByTrip(savedTrip));
    }

    @Override
    @Transactional(readOnly = true)
    public List<TripSeatResponse> getAvailableSeats(UUID tripId) {
        Trip trip = findTripOrThrow(tripId);
        return tripSeatRepository.findByTrip(trip).stream()
                .map(seat -> TripSeatResponse.builder()
                        .tripId(tripId)
                        .tripSeatId(seat.getTripSeatId())
                        .seatNumber(seat.getSeatNumber())
                        .build())
                .toList();
    }

    // -------------------------------------------------------------------------
    // Internal helpers
    // -------------------------------------------------------------------------

    private Trip findTripOrThrow(UUID tripId) {
        return tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip","id", tripId));
    }

    private void validateOwnership(Trip trip, UUID callerUserId) {
        if (!trip.getBus().getOwner().getId().equals(callerUserId))
            throw new AccessDeniedException("You do not own this trip's bus");
    }

    private TripResponse toResponse(Trip trip, int seatsGenerated) {
        return TripResponse.builder()
                .tripId(trip.getTripId())
                .busId(trip.getBus().getId())
                .routeId(trip.getRoute().getRouteId())
                .driverId(trip.getDriver().getId())
                .departureTime(trip.getDepartureTime())
                .expectedDurationMin(trip.getExpectedDurationMin())
                .status(trip.getStatus())
                .seatsGenerated(seatsGenerated)
                .createdAt(trip.getCreatedAt())
                .build();
    }
}
