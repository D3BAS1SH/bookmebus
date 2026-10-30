package com.transit.service.domain.booking;

import com.transit.service.domain.booking.dto.BookingRequest;
import com.transit.service.domain.booking.dto.BookingResponse;
import com.transit.service.domain.booking.dto.DriverPassengerView;
import com.transit.service.domain.user.User;
import com.transit.service.shared.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
@Slf4j
public class BookingController {
    private final BookingService bookingService;

    @PostMapping
    @PreAuthorize("hasRole('TRAVELER')")
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(
            @Valid @RequestBody BookingRequest request,
            @AuthenticationPrincipal User caller
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(bookingService.createBooking(request, caller.getId())));
    }

    @GetMapping("/{bookingId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingById(
            @PathVariable UUID bookingId,
            @AuthenticationPrincipal User caller
    ) {
        return ResponseEntity.ok(ApiResponse.ok(
                bookingService.getBookingById(bookingId, caller.getId())));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('TRAVELER')")
    public ResponseEntity<ApiResponse<Page<BookingResponse>>> getMyBookings(
            @AuthenticationPrincipal User caller,
            Pageable pageable
    ) {
        return ResponseEntity.ok(ApiResponse.ok(
                bookingService.getMyBookings(caller.getId(), pageable)));
    }

    @PatchMapping("/{bookingId}/cancel")
    @PreAuthorize("hasRole('TRAVELER')")
    public ResponseEntity<ApiResponse<Void>> cancelBooking(
            @PathVariable UUID bookingId,
            @AuthenticationPrincipal User caller
    ) {
        bookingService.cancelBooking(bookingId, caller.getId());
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    @GetMapping("/owner")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ApiResponse<Page<BookingResponse>>> getBookingsByOwner(
            @AuthenticationPrincipal User caller,
            Pageable pageable
    ) {
        return ResponseEntity.ok(ApiResponse.ok(
                bookingService.getBookingsByOwner(caller.getId(), pageable)));
    }

    @GetMapping("/trip/{tripId}")
    @PreAuthorize("hasRole('OWNER') or hasRole('DRIVER')")
    public ResponseEntity<ApiResponse<List<DriverPassengerView>>> getBookingsByTrip(
            @PathVariable UUID tripId,
            @AuthenticationPrincipal User caller
    ) {
        return ResponseEntity.ok(ApiResponse.ok(
                bookingService.getBookingsByTrip(tripId, caller.getId())));
    }

    @PatchMapping("/{bookingId}/board")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<ApiResponse<BookingResponse>> verifyBoarding(
            @PathVariable UUID bookingId,
            @AuthenticationPrincipal User caller
    ) {
        return ResponseEntity.ok(ApiResponse.ok(
                bookingService.verifyBoarding(bookingId, caller.getId())));
    }
}
