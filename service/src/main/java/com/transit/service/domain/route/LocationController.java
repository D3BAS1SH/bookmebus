package com.transit.service.domain.route;

import com.transit.service.domain.route.dto.LocationRequest;
import com.transit.service.domain.route.dto.LocationResponse;
import com.transit.service.domain.route.dto.LocationUpdateRequest;
import com.transit.service.shared.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/location")
@RequiredArgsConstructor
@Slf4j
public class LocationController {
    private final LocationService locationService;

    @PostMapping
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ApiResponse<LocationResponse>> addLocation(@Valid @RequestBody LocationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(locationService.addLocation(request)));
    }

    @GetMapping("/all-location")
    public ResponseEntity<ApiResponse<List<LocationResponse>>> getAllLocation() {
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.ok(locationService.getAllLocation()));
    }

    @GetMapping("/{locationId}")
    public ResponseEntity<ApiResponse<LocationResponse>> getLocation(@PathVariable UUID locationId) {
        LocationResponse locationResponse = locationService.getLocation(locationId);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.ok(locationResponse));
    }

    @GetMapping("/route/{routeId}")
    public ResponseEntity<ApiResponse<List<LocationResponse>>> getRoute(@PathVariable UUID routeId) {
        List<LocationResponse> allLocationResponse = locationService.getAllLocationOfRoute(routeId);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.ok(allLocationResponse));
    }

    @PatchMapping("/{locationId}")
    public ResponseEntity<ApiResponse<LocationResponse>> updateLocation(@PathVariable UUID locationId, @Valid @RequestBody LocationUpdateRequest locationRequest) {
        LocationResponse locationResponse = locationService.updateLocation(locationId, locationRequest);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.ok(locationResponse));
    }

    @DeleteMapping("/{locationId}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<Void> deleteLocation(@PathVariable UUID locationId) {
        locationService.deleteLocation(locationId);
        return ResponseEntity.noContent().build();
    }
}
