package com.transit.service.domain.trip;

import com.transit.service.domain.trip.dto.TripRequest;
import com.transit.service.domain.trip.dto.TripResponse;
import com.transit.service.domain.trip.dto.TripSeatResponse;
import com.transit.service.domain.user.User;
import com.transit.service.shared.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/trips")
@Slf4j
@RequiredArgsConstructor
public class TripController {
    private final TripService tripService;

    @PostMapping
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ApiResponse<TripResponse>> createTrip(
            @Valid @RequestBody TripRequest request,
            @AuthenticationPrincipal User caller
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(tripService.createTrip(request, caller.getId())));
    }

    @GetMapping("/{tripId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<TripResponse>> getTripById(
            @PathVariable UUID tripId
    ) {
        return ResponseEntity.ok(ApiResponse.ok(tripService.getTripById(tripId)));
    }

    @GetMapping("/search")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Page<TripResponse>>> searchTrips(
            @RequestParam UUID routeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            Pageable pageable
    ) {
        return ResponseEntity.ok(ApiResponse.ok(tripService.searchTrips(routeId, date, pageable
        )));
    }

    @GetMapping("/search/segment")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Page<TripResponse>>> searchTripsBySegment(
            @RequestParam UUID originLocationId,
            @RequestParam UUID destinationLocationId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            Pageable pageable
    ) {
        return ResponseEntity.ok(
                ApiResponse.ok(
                        tripService.searchTripsBySegment(
                                originLocationId,
                                destinationLocationId,
                                date,
                                pageable
                        )
                )
        );
    }

    @GetMapping("/owner")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ApiResponse<Page<TripResponse>>> getTripsByOwner(
            @AuthenticationPrincipal User caller,
            Pageable pageable
    ) {
        return ResponseEntity.ok(ApiResponse.ok(tripService.getTripsByOwner(caller.getId(), pageable)));
    }

    @PutMapping("/{tripId}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ApiResponse<TripResponse>> updateTrip(
            @PathVariable UUID tripId,
            @Valid @RequestBody TripRequest request,
            @AuthenticationPrincipal User caller
    ) {
        return ResponseEntity.ok(ApiResponse.ok(tripService.updateTrip(tripId, request, caller.getId())));
    }

    @PatchMapping("/{tripId}/cancel")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ApiResponse<Void>> cancelTrip(
            @PathVariable UUID tripId,
            @AuthenticationPrincipal User caller
    ) {
        tripService.cancelTrip(tripId, caller.getId());
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    @DeleteMapping("/{tripId}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<Void> deleteTrip(
            @PathVariable UUID tripId,
            @AuthenticationPrincipal User caller
    ) {
        tripService.deleteTrip(tripId, caller.getId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/driver")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<ApiResponse<Page<TripResponse>>> getTripsByDriver(
            @AuthenticationPrincipal User caller,
            Pageable pageable
    ) {
        return ResponseEntity.ok(ApiResponse.ok(tripService.getTripsByDriver(caller.getId(), pageable)));
    }

    @PatchMapping("/{tripId}/start")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<ApiResponse<TripResponse>> startTrip(
            @PathVariable UUID tripId,
            @AuthenticationPrincipal User caller
    ) {
        return ResponseEntity.ok(ApiResponse.ok(tripService.startTrip(tripId, caller.getId())));
    }

    @PatchMapping("/{tripId}/complete")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<ApiResponse<TripResponse>> completeTrip(
            @PathVariable UUID tripId,
            @AuthenticationPrincipal User caller
    ) {
        return ResponseEntity.ok(ApiResponse.ok(tripService.completeTrip(tripId, caller.getId())));
    }

    @GetMapping("/{tripId}/seats")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<TripSeatResponse>>> getSeats(
            @PathVariable UUID tripId,
            @RequestParam(required = false) UUID boardingLocationId,
            @RequestParam(required = false) UUID dropoffLocationpId
    ) {
        return ResponseEntity.ok(ApiResponse.ok(
                tripService.getAvailableSeats(tripId, boardingLocationId, dropoffLocationpId)));
    }
}
