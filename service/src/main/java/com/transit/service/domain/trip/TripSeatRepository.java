package com.transit.service.domain.trip;

import com.transit.service.domain.booking.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface TripSeatRepository extends JpaRepository<TripSeat, UUID> {
    int countByTrip(Trip trip);
    List<TripSeat> findByTrip(Trip trip);

    /**
     * Returns true if the given seat has a CONFIRMED booking whose segment
     * overlaps the requested [boardingSeq, dropoffSeq).
     *
     * Overlap condition (same as BookingRepository.existsOverlappingBooking):
     *   existing.boardingSeq < requestedDropoff
     *   AND existing.dropoffSeq > requestedBoarding
     *
     * Used by getAvailableSeats() in segment mode to mark each seat
     * AVAILABLE or BOOKED for the traveler's specific journey.
     */
    @Query("""
        SELECT COUNT(b) > 0
        FROM Booking b
        WHERE b.tripSeat.tripSeatId = :tripSeatId
          AND b.bookingStatus = com.transit.service.domain.booking.BookingStatus.CONFIRMED
          AND b.boardingSequence < :dropoffSeq
          AND b.dropoffSequence  > :boardingSeq
        """)
    boolean existsOverlappingBookingForSeat(
            @Param("tripSeatId") UUID tripSeatId,
            @Param("boardingSeq") int boardingSeq,
            @Param("dropoffSeq") int dropoffSeq
    );

    /**
     * Returns all CONFIRMED bookings for a given seat, with stop names
     * resolved via joins to boardingPoint and dropoffPoint (Location entity).
     *
     * Used by getAvailableSeats() in general mode (no segment params) to
     * populate BookedSegmentInfo for each seat — lets owners and drivers
     * see exactly which route segments are occupied on each seat.
     */
    @Query("""
        SELECT b
        FROM Booking b
        WHERE b.tripSeat.tripSeatId = :tripSeatId
          AND b.bookingStatus = com.transit.service.domain.booking.BookingStatus.CONFIRMED
        ORDER BY b.boardingSequence ASC
        """)
    List<Booking> findConfirmedBookingsForSeat(@Param("tripSeatId") UUID tripSeatId);
}
