package com.transit.service.domain.trip.location;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Payload broadcast to STOMP topic: /topic/trip.{tripId}.location
 *
 * Travelers subscribed to this topic receive this message every time
 * the driver POSTs a new GPS coordinate.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LocationMessage {
    /** The trip this location update belongs to. */
    private UUID tripId;

    /** Current latitude of the bus. */
    private BigDecimal latitude;

    /** Current longitude of the bus. */
    private BigDecimal longitude;

    /**
     * Server-side timestamp of when this update was received.
     * Clients can use this to detect stale updates.
     */
    private Instant timestamp;
}
