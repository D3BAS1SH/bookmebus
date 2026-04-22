package com.transit.service.domain.booking;

import com.transit.service.domain.booking.dto.BookingRequest;
import com.transit.service.domain.booking.dto.BookingResponse;
import com.transit.service.domain.route.RouteStop;
import com.transit.service.domain.route.RouteStopRepository;
import com.transit.service.domain.trip.*;
import com.transit.service.domain.trip.TripSeat;
import com.transit.service.domain.user.User;
import com.transit.service.domain.user.UserRepository;
import com.transit.service.shared.exception.BusinessException;
import com.transit.service.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final TripRepository tripRepository;
    private final TripSeatRepository tripSeatRepository;
    private final RouteStopRepository routeStopRepository;
    private final UserRepository userRepository;
    private final StringRedisTemplate redisTemplate;

    private static final long LOCK_EXPIRY_SECONDS = 10;

    @Override
    @Transactional
    public BookingResponse createBooking(BookingRequest request, UUID travelerUserId) {
        Trip trip = this.tripRepository.findByIdWithDetails(request.getTripId()).orElseThrow(()-> new ResourceNotFoundException("Trip", "id", request.getTripId()));

        if (!trip.getStatus().equals(TripStatus.SCHEDULED)) {
            throw new BusinessException("Booking is only allowed on SCHEDULED trips");
        }

        TripSeat tripSeat = this.tripSeatRepository.findById(request.getTripSeatId()).orElseThrow(()-> new ResourceNotFoundException("TripSeat", "id", request.getTripSeatId()));

        if (!tripSeat.getTrip().getTripId().equals(trip.getTripId())) {
            throw new BusinessException("Seat does not belong to this trip");
        }

        User traveler = this.userRepository.findById(travelerUserId).orElseThrow(()-> new ResourceNotFoundException("User", "id", travelerUserId));

        RouteStop boardingRouteStop = this.routeStopRepository
                .findByRoute_RouteIdAndLocation_LocationId(trip.getRoute().getRouteId(), request.getBoardingStopId())
                .orElseThrow(() -> new BusinessException("Boarding stop is not on this route"));
        RouteStop dropoffRouteStop = this.routeStopRepository
                .findByRoute_RouteIdAndLocation_LocationId(trip.getRoute().getRouteId(), request.getDropoffStopId())
                .orElseThrow(() -> new BusinessException("Dropoff stop is not on this route"));

        if (!boardingRouteStop.isBoardingPoint()) {
            throw new BusinessException("Selected boarding stop does not allow boarding");
        }

        if (!dropoffRouteStop.isDroppingPoint()) {
            throw new BusinessException("Selected dropoff stop does not allow dropping");
        }

        int boardingSeq = boardingRouteStop.getSequenceOrder();
        int dropoffSeq = dropoffRouteStop.getSequenceOrder();

        if (dropoffSeq <= boardingSeq) {
            throw new BusinessException("Dropoff stop must be after boarding stop");
        }

        // 2. Acquire Redis lock
        String lockKey = "lock:trip:" + trip.getTripId() + ":seat:" + tripSeat.getTripSeatId();
        Boolean lockAcquired = redisTemplate.opsForValue()
                .setIfAbsent(lockKey, travelerUserId.toString(), LOCK_EXPIRY_SECONDS, TimeUnit.SECONDS);

        if (Boolean.FALSE.equals(lockAcquired)) {
            throw new BusinessException("Seat is currently being booked, please try again");
        }

        try {
            boolean overlaps = bookingRepository.existsOverlappingBooking(tripSeat.getTripSeatId(), dropoffSeq, boardingSeq);
            if (overlaps) {
                throw new BusinessException("Booking is already overlapping");
            }

            // 4. Price calculation
            BigDecimal distance = dropoffRouteStop.getDistanceFromOrigin()
                    .subtract(boardingRouteStop.getDistanceFromOrigin());
            BigDecimal totalPrice = distance.multiply(trip.getBus().getPricePerKm());

            // 5. Generate booking code
            String bookingCode = generateBookingCode();

            // 6. Persist booking
            Booking booking = Booking.builder()
                    .trip(trip)
                    .traveler(traveler)
                    .tripSeat(tripSeat)
                    .boardingPoint(boardingRouteStop.getLocation())
                    .dropoffPoint(dropoffRouteStop.getLocation())
                    .boardingSequence(boardingSeq)
                    .dropoffSequence(dropoffSeq)
                    .totalPrice(totalPrice)
                    .bookingCode(bookingCode)
                    .bookingStatus(BookingStatus.CONFIRMED)
                    .build();

            Booking savedBooking = bookingRepository.save(booking);

            // 7. Increment TripSeat version manually
            tripSeat.setVersion(tripSeat.getVersion() + 1);
            tripSeatRepository.save(tripSeat);

            log.info("Booking confirmed: bookingId={} code={} seat={} userId={}",
                    savedBooking.getBookingId(), bookingCode,
                    tripSeat.getSeatNumber(), travelerUserId);

            return toResponse(savedBooking);
        } finally {
            // 8. Always release lock
            redisTemplate.delete(lockKey);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponse getBookingById(UUID bookingId, UUID callerUserId) {
        Booking booking = findBookingOrThrow(bookingId);

        // Traveler can only see their own booking
        // Owner can see any booking on their trips
        boolean isOwner = booking.getTrip().getBus().getOwner().getId().equals(callerUserId);
        boolean isTraveler = booking.getTraveler().getId().equals(callerUserId);

        if (!isOwner && !isTraveler) {
            throw new AccessDeniedException("You do not have access to this booking");
        }

        return toResponse(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BookingResponse> getMyBookings(UUID callerUserId, Pageable pageable) {
        userRepository.findById(callerUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "Id", callerUserId));

        return bookingRepository.findByUserId(callerUserId, pageable)
                .map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BookingResponse> getBookingsByOwner(UUID ownerId, Pageable pageable) {
        userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Owner", "Id", ownerId));

        return bookingRepository.findByOwnerId(ownerId, pageable)
                .map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getBookingsByTrip(UUID tripId, UUID callerUserId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip", "Id", tripId));

        // Only the trip's owner or assigned driver can see all bookings
        boolean isOwner = trip.getBus().getOwner().getId().equals(callerUserId);
        boolean isDriver = trip.getDriver().getId().equals(callerUserId);

        if (!isOwner && !isDriver)
            throw new AccessDeniedException("You do not have access to this trip's bookings");

        return bookingRepository.findConfirmedByTripId(tripId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public void cancelBooking(UUID bookingId, UUID callerUserId) {
        Booking booking = findBookingOrThrow(bookingId);

        if (!booking.getTraveler().getId().equals(callerUserId))
            throw new AccessDeniedException("You can only cancel your own bookings");

        if (booking.getBookingStatus().equals(BookingStatus.CANCELED))
            throw new BusinessException("Booking is already canceled");

        if (booking.getTrip().getStatus().equals(TripStatus.COMPLETED))
            throw new BusinessException("Cannot cancel a booking for a completed trip");

        booking.setBookingStatus(BookingStatus.CANCELED);
        bookingRepository.save(booking);

        log.info("Booking canceled: bookingId={} userId={}", bookingId, callerUserId);
        // Phase 4 — trigger refund / notification here
    }

    @Override
    @Transactional
    public BookingResponse verifyBoarding(UUID bookingId, UUID driverUserId) {
        Booking booking = findBookingOrThrow(bookingId);

        if (!booking.getTrip().getDriver().getId().equals(driverUserId))
            throw new AccessDeniedException("You are not the driver for this trip");

        if (!booking.getBookingStatus().equals(BookingStatus.CONFIRMED))
            throw new BusinessException("Only CONFIRMED bookings can be verified for boarding");

        booking.setDidBoard(true);
        Booking saved = bookingRepository.save(booking);

        log.info("Boarding verified: bookingId={} driverUserId={}", bookingId, driverUserId);
        return toResponse(saved);
    }

    // Private Helpers
    private Booking findBookingOrThrow(UUID bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "Id", bookingId));
    }

    private String generateBookingCode() {
        return UUID.randomUUID().toString()
                .replace("-", "")
                .substring(0, 8)
                .toUpperCase();
    }

    private BookingResponse toResponse(Booking booking) {
        return BookingResponse.builder()
                .bookingId(booking.getBookingId())
                .tripId(booking.getTrip().getTripId())
                .userId(booking.getTraveler().getId())
                .tripSeatId(booking.getTripSeat().getTripSeatId())
                .seatNumber(booking.getTripSeat().getSeatNumber())
                .boardingStopName(booking.getBoardingPoint().getLocationName())
                .dropoffStopName(booking.getDropoffPoint().getLocationName())
                .boardingSeq(booking.getBoardingSequence())
                .dropoffSeq(booking.getDropoffSequence())
                .totalPrice(booking.getTotalPrice())
                .bookingCode(booking.getBookingCode())
                .qrCodePath(booking.getQrCodepath())
                .ticketPdfPath(booking.getTicketPdfPath())
                .didBoard(booking.isDidBoard())
                .status(booking.getBookingStatus())
                .bookedAt(booking.getBookingAt())
                .build();
    }
}
