package com.transit.service.domain.trip.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
public class TripRequest {
    @NotNull(message = "Bus ID is required")
    private UUID busId;

    @NotNull(message = "Route ID is required")
    private UUID routeId;

    @NotNull(message = "Driver ID is required")
    private UUID driverId;

    @NotNull(message = "Departure time is required")
    @Future(message = "Departure time must be in the future")
    private OffsetDateTime departureTime;

    @Positive(message = "Expected duration must be positive")
    private int expectedDurationMin;
}
