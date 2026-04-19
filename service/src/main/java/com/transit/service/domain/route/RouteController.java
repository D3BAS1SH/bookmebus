package com.transit.service.domain.route;

import com.transit.service.domain.route.dto.RouteRequest;
import com.transit.service.domain.route.dto.RouteResponse;
import com.transit.service.domain.route.dto.RouteStopRequest;
import com.transit.service.domain.user.User;
import com.transit.service.shared.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/route")
@RequiredArgsConstructor
@Slf4j
public class RouteController {
    private final RouteService routeService;

    @PostMapping
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ApiResponse<RouteResponse>> createRoute(
            @Valid @RequestBody RouteRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(routeService.createRoute(request, user.getId())));
    }

    @GetMapping("/{routeId}")
    public ResponseEntity<ApiResponse<RouteResponse>> getRoute(
            @PathVariable UUID routeId) {
        return ResponseEntity.ok(ApiResponse.ok(routeService.getRoute(routeId)));
    }

    @GetMapping("/owner")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ApiResponse<List<RouteResponse>>> getOwnerRoutes(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(routeService.getOwnerRoutes(user.getId())));
    }

    @PostMapping("/{routeId}/stops")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ApiResponse<RouteResponse>> addStop(
            @PathVariable UUID routeId,
            @Valid @RequestBody RouteStopRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(routeService.addStop(routeId, request)));
    }

    @DeleteMapping("/{routeId}/stops/{routeStopId}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ApiResponse<RouteResponse>> removeStop(
            @PathVariable UUID routeId,
            @PathVariable UUID routeStopId) {
        return ResponseEntity.ok(ApiResponse.ok(routeService.removeStop(routeId, routeStopId)));
    }

    @DeleteMapping("/{routeId}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<Void> deleteRoute(
            @PathVariable UUID routeId,
            @AuthenticationPrincipal User user) {
        routeService.deleteRoute(user.getId(), routeId);
        return ResponseEntity.noContent().build();
    }
}
