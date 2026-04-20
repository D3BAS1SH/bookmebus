package com.transit.service.domain.booking;

import com.transit.service.domain.booking.dto.BookingRequest;
import com.transit.service.domain.booking.dto.BookingResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface BookingService {
    // Traveler operations
    BookingResponse createBooking(BookingRequest request, UUID callerUserId);
    BookingResponse getBookingById(UUID bookingId, UUID callerUserId);
    Page<BookingResponse> getMyBookings(UUID callerUserId, Pageable pageable);
    void cancelBooking(UUID bookingId, UUID callerUserId);

    // Owner operations
    Page<BookingResponse> getBookingsByOwner(UUID ownerId, Pageable pageable);
    List<BookingResponse> getBookingsByTrip(UUID tripId, UUID callerUserId);

    // Driver operations — Phase 4
    BookingResponse verifyBoarding(UUID bookingId, UUID driverUserId);
}
