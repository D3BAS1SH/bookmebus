package com.transit.service.domain.trip.location;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.transit.service.domain.trip.Trip;
import com.transit.service.domain.trip.TripRepository;
import com.transit.service.domain.trip.TripStatus;
import com.transit.service.domain.user.User;
import com.transit.service.shared.exception.BusinessException;
import com.transit.service.shared.exception.ResourceNotFoundException;
import com.transit.service.shared.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

/**
 * [F-09] Driver location emit endpoint.
 *
 * Flow:
 *   1. Driver app calls POST /api/v1/trips/{tripId}/location every ~5–10s
 *   2. Controller validates: DRIVER role, assigned to this trip, trip is IN_TRANSIT
 *   3. Stores latest location in Redis (TTL 5 min) — used by ProximityScheduler
 *   4. Broadcasts LocationMessage to STOMP topic /topic/trip.{tripId}.location
 *      → All subscribed traveler apps receive the push instantly
 *
 * Redis key: trip:location:{tripId}
 *   Value: JSON of LocationMessage
 *   TTL: 5 minutes (if driver stops emitting, stale data expires)
 */
@RestController
@RequestMapping("/api/v1/trips")
@RequiredArgsConstructor
@Slf4j
public class DriverLocationEmitController {

    private static final String LOCATION_KEY_PREFIX = "trip:location:";
    private static final Duration LOCATION_TTL      = Duration.ofMinutes(5);
    private static final String TOPIC_PREFIX        = "/topic/trip.";
    private static final String TOPIC_SUFFIX        = ".location";

    private final TripRepository tripRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    /**
     * POST /api/v1/trips/{tripId}/location
     *
     * Security: ROLE_DRIVER only (@PreAuthorize).
     * The standard JwtAuthenticationFilter handles token extraction — this
     * endpoint is protected like any other authenticated REST endpoint.
     */
    @PostMapping("/{tripId}/location")
    @PreAuthorize("hasRole('DRIVER')")
    public ApiResponse<LocationMessage> emitLocation(
            @PathVariable UUID tripId,
            @Valid @RequestBody DriverLocationEmitRequest request,
            @AuthenticationPrincipal User driver
    ) {
        // 1. Resolve trip
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip", "id", tripId));

        // 2. Verify this driver is assigned to this trip
        if (!trip.getDriver().getId().equals(driver.getId())) {
            throw new AccessDeniedException("You are not the assigned driver for this trip");
        }

        // 3. Verify trip is actively running
        if (!TripStatus.IN_TRANSIT.equals(trip.getStatus())) {
            throw new BusinessException("Location updates are only accepted for IN_TRANSIT trips");
        }

        // 4. Build the broadcast message
        LocationMessage message = LocationMessage.builder()
                .tripId(tripId)
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .timestamp(Instant.now())
                .build();

        // 5. Persist latest location to Redis for the proximity scheduler
        String redisKey = LOCATION_KEY_PREFIX + tripId;
        try {
            String json = objectMapper.writeValueAsString(message);
            redisTemplate.opsForValue().set(redisKey, json, LOCATION_TTL);
        } catch (JsonProcessingException ex) {
            // Non-fatal — log and continue with the broadcast
            log.error("Failed to serialize LocationMessage to Redis for tripId={}: {}", tripId, ex.getMessage());
        }

        // 6. Broadcast to all STOMP subscribers on this trip's topic
        String topic = TOPIC_PREFIX + tripId + TOPIC_SUFFIX;
        messagingTemplate.convertAndSend(topic, message);

        log.debug("Location emitted: tripId={} lat={} lng={} → topic={}",
                tripId, request.getLatitude(), request.getLongitude(), topic);

        return ApiResponse.ok(message);
    }
}
