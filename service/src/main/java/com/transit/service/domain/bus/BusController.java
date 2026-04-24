package com.transit.service.domain.bus;

import com.transit.service.domain.bus.dto.BusRequest;
import com.transit.service.domain.bus.dto.BusResponse;
import com.transit.service.domain.bus.dto.BusStatusUpdateRequest;
import com.transit.service.domain.user.User;
import com.transit.service.domain.user.UserRole;
import com.transit.service.shared.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/buses")
@RequiredArgsConstructor
public class BusController {
    private final BusService busService;

    /**
     * POST /api/v1/buses
     * Register a new bus under the authenticated owner.
     */
    @PostMapping()
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ApiResponse<BusResponse>> createBus(
            @Valid @RequestBody BusRequest busRequest,
            @AuthenticationPrincipal User currentUser
            ) {
        BusResponse busResponse = this.busService.createBus(busRequest,currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(busResponse));
    }

    /**
     * GET /api/v1/buses
     * Fetch all buses owned by the authenticated owner (all statuses).
     */
    @GetMapping
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ApiResponse<List<BusResponse>>> getAllMyBuses(
            @AuthenticationPrincipal User currentUser
    ) {
        List<BusResponse> buses = busService.getAllBusesByOwner(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.ok(buses));
    }

    /**
     * GET /api/v1/buses/{busId}
     * Fetch a single bus by ID, scoped to the authenticated owner.
     */
    @GetMapping("/{busId}")
    @PreAuthorize("hasAnyRole('OWNER','TRAVELER')")
    public ResponseEntity<ApiResponse<BusResponse>> getBusById(
            @PathVariable UUID busId,
            @AuthenticationPrincipal User currentUser
    ) {
        if(currentUser.getRole().equals(UserRole.TRAVELER)){
            BusResponse busResponse = this.busService.getBusById(busId);
            return ResponseEntity.ok(ApiResponse.ok(busResponse));
        }
        BusResponse response = busService.getBusById(busId, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    /**
     * PUT /api/v1/buses/{busId}
     * Update registration, vehicle number, price per km, and seat layout.
     * Status is NOT updated here — use PATCH /status.
     */
    @PutMapping("/{busId}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ApiResponse<BusResponse>> updateBus(
            @PathVariable UUID busId,
            @Valid @RequestBody BusRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        BusResponse response = busService.updateBus(busId, request, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    /**
     * PATCH /api/v1/buses/{busId}/status
     * Toggle bus status between ACTIVE and MAINTENANCE.
     */
    @PatchMapping("/{busId}/status")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ApiResponse<BusResponse>> updateBusStatus(
            @PathVariable UUID busId,
            @Valid @RequestBody BusStatusUpdateRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        BusResponse response = busService.updateBusStatus(busId, request, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

}
