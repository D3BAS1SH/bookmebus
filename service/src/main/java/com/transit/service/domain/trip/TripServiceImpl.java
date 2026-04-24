package com.transit.service.domain.trip;

import com.transit.service.domain.booking.Booking;
import com.transit.service.domain.booking.BookingStatus;
import com.transit.service.domain.bus.Bus;
import com.transit.service.domain.bus.BusRepository;
import com.transit.service.domain.bus.SeatLayoutGenerator;
import com.transit.service.domain.route.*;
import com.transit.service.domain.trip.dto.SeatStatus;
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

import java.math.BigDecimal;
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
    private final RouteStopRepository routeStopRepository;
    private final LocationRepository locationRepository;

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

        if (trip.getStatus().equals(TripStatus.CANCELED))
            throw new BusinessException("Trip is already canceled");

        trip.setStatus(TripStatus.CANCELED);
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
    public List<TripSeatResponse> getAvailableSeats(
            UUID tripId,
            UUID boardingLocationId,
            UUID dropoffLocationId) {

        Trip trip = findTripOrThrow(tripId);
        System.out.println("Found Trip");
        List<TripSeat> seats = tripSeatRepository.findByTrip(trip);
        System.out.println("Found Seats");
        boolean segmentMode = boardingLocationId != null && dropoffLocationId != null;

        if (segmentMode) {
            System.out.println("Found Segment Mode");
            return getSeatsForSegment(trip, seats, boardingLocationId, dropoffLocationId);
        } else {
            System.out.println("Using non segment mode");
            return getSeatsGeneral(seats);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TripResponse> searchTripsBySegment(
            UUID originLocationId,
            UUID destinationLocationId,
            LocalDate date,
            Pageable pageable
    ) {
        // Validate both locations exist
        if (!locationRepository.existsById(originLocationId))
            throw new ResourceNotFoundException("Location", "Id", originLocationId);

        if (!locationRepository.existsById(destinationLocationId))
            throw new ResourceNotFoundException("Location", "Id", destinationLocationId);

        if (originLocationId.equals(destinationLocationId))
            throw new BusinessException("Origin and destination cannot be the same");

        Page<Trip> trips = tripRepository.searchByOriginAndDestination(
                originLocationId, destinationLocationId, date, pageable);

        return trips.map(trip -> {

            // Get boarding and dropoff RouteStops for this trip's route
            RouteStop boardingStop = routeStopRepository
                    .findByRouteAndLocationId(trip.getRoute(), originLocationId)
                    .orElse(null);

            RouteStop dropoffStop = routeStopRepository
                    .findByRouteAndLocationId(trip.getRoute(), destinationLocationId)
                    .orElse(null);

            // Calculate estimated price
            BigDecimal estimatedPrice = null;
            if (boardingStop != null && dropoffStop != null) {
                BigDecimal distance = dropoffStop.getDistanceFromOrigin()
                        .subtract(boardingStop.getDistanceFromOrigin());
                estimatedPrice = distance.multiply(trip.getBus().getPricePerKm());
            }

            // Count available seats for this segment
            int availableSeats = 0;
            if (boardingStop != null && dropoffStop != null) {
                availableSeats = tripSeatRepository.countAvailableSeats(
                        trip.getTripId(),
                        boardingStop.getSequenceOrder(),
                        dropoffStop.getSequenceOrder()
                );
            }

            return toSearchResponse(trip, estimatedPrice, availableSeats);
        });
    }

    // -------------------------------------------------------------------------
    // Internal helpers
    // -------------------------------------------------------------------------

    /**
     * For each seat, runs the overlap check against the requested segment.
     * Marks AVAILABLE or BOOKED. No bookedSegments list populated — unnecessary
     * when the traveler already knows their own journey.
     */
    private List<TripSeatResponse> getSeatsForSegment(
            Trip trip,
            List<TripSeat> seats,
            UUID boardingLocationId,
            UUID dropoffLocationId) {

        // Resolve sequence numbers for the requested stops
        RouteStop boardingStop = routeStopRepository
                .findByRoute_RouteIdAndLocation_LocationId(trip.getRoute().getRouteId(), boardingLocationId)
                .orElseThrow(() -> new BusinessException("Boarding stop is not on this route"));

        RouteStop dropoffStop = routeStopRepository
                .findByRoute_RouteIdAndLocation_LocationId(trip.getRoute().getRouteId(), dropoffLocationId)
                .orElseThrow(() -> new BusinessException("Dropoff stop is not on this route"));

        if (dropoffStop.getSequenceOrder() <= boardingStop.getSequenceOrder())
            throw new BusinessException("Dropoff stop must be after boarding stop");

        int boardingSeq = boardingStop.getSequenceOrder();
        int dropoffSeq = dropoffStop.getSequenceOrder();

        return seats.stream()
                .map(seat -> {
                    boolean isBooked = tripSeatRepository.existsOverlappingBookingForSeat(
                            seat.getTripSeatId(), boardingSeq, dropoffSeq, BookingStatus.CANCELED);

                    return TripSeatResponse.builder()
                            .tripId(trip.getTripId())
                            .tripSeatId(seat.getTripSeatId())
                            .seatNumber(seat.getSeatNumber())
                            .seatStatus(isBooked ? SeatStatus.BOOKED : SeatStatus.AVAILABLE)
                            .bookedSegments(List.of()) // empty in segment mode
                            .build();
                })
                .toList();
    }

    /**
     * For each seat, fetches all confirmed bookings and builds a BookedSegmentInfo
     * list with human-readable stop names. Marks AVAILABLE or PARTIALLY_BOOKED.
     *
     * No sequence-based math here — just "does any booking exist on this seat?"
     */
    private List<TripSeatResponse> getSeatsGeneral(List<TripSeat> seats) {
        return seats.stream()
                .map(seat -> {
//                    System.out.println("Inside general calling getSeatsGeneral");
                    List<Booking> bookings = tripSeatRepository
                            .findConfirmedBookingsForSeat(seat.getTripSeatId(),BookingStatus.CONFIRMED);
//                    System.out.println("Inside map for booking");
                    List<TripSeatResponse.BookedSegmentInfo> segmentInfos = bookings.stream()
                            .map(b -> TripSeatResponse.BookedSegmentInfo.builder()
                                    .boardingSeq(b.getBoardingSequence())
                                    .dropoffSeq(b.getDropoffSequence())
                                    // Location names come from the Booking associations
                                    // boardingPoint and dropoffPoint are Location entities
                                    .boardingStopName(b.getBoardingPoint().getLocationName())
                                    .dropoffStopName(b.getDropoffPoint().getLocationName())
                                    .build())
                            .toList();

                    SeatStatus status = bookings.isEmpty()
                            ? SeatStatus.AVAILABLE
                            : SeatStatus.PARTIALLY_BOOKED;

                    return TripSeatResponse.builder()
                            .tripId(seat.getTrip().getTripId())
                            .tripSeatId(seat.getTripSeatId())
                            .seatNumber(seat.getSeatNumber())
                            .seatStatus(status)
                            .bookedSegments(segmentInfos)
                            .build();
                })
                .toList();
    }

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
                .busRegistrationNumber(trip.getBus().getRegistrationNumber())
                .routeId(trip.getRoute().getRouteId())
                .routeName(trip.getRoute().getRouteName())
                .driverId(trip.getDriver().getId())
                .departureTime(trip.getDepartureTime())
                .expectedDurationMin(trip.getExpectedDurationMin())
                .status(trip.getStatus())
                .seatsGenerated(seatsGenerated)
                .createdAt(trip.getCreatedAt())
                .build();
    }

    private TripResponse toSearchResponse(Trip trip, BigDecimal estimatedPrice, int availableSeats) {
        return TripResponse.builder()
                .tripId(trip.getTripId())
                .busId(trip.getBus().getId())
                .busRegistrationNumber(trip.getBus().getRegistrationNumber())
                .routeId(trip.getRoute().getRouteId())
                .routeName(trip.getRoute().getRouteName())
                .driverId(trip.getDriver().getId())
                .departureTime(trip.getDepartureTime())
                .expectedDurationMin(trip.getExpectedDurationMin())
                .status(trip.getStatus())
                .seatsGenerated(tripSeatRepository.countByTrip(trip))
                .availableSeats(availableSeats)
                .estimatedPrice(estimatedPrice)
                .createdAt(trip.getCreatedAt())
                .build();
    }
}
