package com.transit.service.domain.booking;

import com.transit.service.domain.trip.Trip;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BookingRepository extends JpaRepository<Booking, UUID> {
    // Overlap check — core of the booking logic
    @Query("""
        SELECT COUNT(b) > 0
        FROM Booking b
        WHERE b.tripSeat.tripSeatId = :tripSeatId
          AND b.bookingStatus = :status
          AND b.boardingSequence < :dropoffSeq
          AND b.dropoffSequence  > :boardingSeq
    """)
    boolean existsOverlappingBooking(
            @Param("tripSeatId") UUID tripSeatId,
            @Param("dropoffSeq") int dropoffSeq,
            @Param("boardingSeq") int boardingSeq,
            @Param("status") BookingStatus status
    );

    // Traveler's booking history — Phase 3 Part 2
    @Query(value = """
        SELECT b FROM Booking b
        JOIN FETCH b.trip t
        JOIN FETCH b.tripSeat ts
        JOIN FETCH b.boardingPoint
        JOIN FETCH b.dropoffPoint
        WHERE b.traveler.id = :userId
    """,
    countQuery = """
        SELECT COUNT(b) FROM Booking b
        WHERE b.traveler.id = :userId
    """)
    Page<Booking> findByUserId(
            @Param("userId") UUID userId,
            Pageable pageable
    );

    // Owner — all bookings across their trips
    @Query(value = """
        SELECT b FROM Booking b
        JOIN FETCH b.trip t
        JOIN FETCH b.tripSeat ts
        JOIN FETCH b.boardingPoint
        JOIN FETCH b.dropoffPoint
        WHERE t.bus.owner.id = :ownerId
    """,
            countQuery = """
        SELECT COUNT(b) FROM Booking b
        JOIN b.trip t
        WHERE t.bus.owner.id = :ownerId
    """)
    Page<Booking> findByOwnerId(
            @Param("ownerId") UUID ownerId,
            Pageable pageable
    );

    // All bookings for a specific trip — used by owner/driver
    @Query("""
        SELECT b FROM Booking b
        JOIN FETCH b.tripSeat ts
        JOIN FETCH b.boardingPoint
        JOIN FETCH b.dropoffPoint
        JOIN FETCH b.traveler
        WHERE b.trip.tripId = :tripId
        AND b.bookingStatus = 'CONFIRMED'
    """)
    List<Booking> findConfirmedByTripId(@Param("tripId") UUID tripId);

    // Lookup by booking code — used by driver for QR scan in Phase 4
    Optional<Booking> findByBookingCode(String bookingCode);
}
