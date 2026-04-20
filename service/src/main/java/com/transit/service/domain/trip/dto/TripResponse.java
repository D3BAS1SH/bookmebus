package com.transit.service.domain.trip.dto;

import com.transit.service.domain.trip.TripStatus;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
public class TripResponse {
    private UUID tripId;
    private UUID busId;
    private UUID routeId;
    private UUID driverId;
    private OffsetDateTime departureTime;
    private int expectedDurationMin;
    private TripStatus status;
    private int seatsGenerated;
    private Instant createdAt;
}
