package com.transit.service.domain.trip.dto;

import com.transit.service.domain.trip.TripStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
public class TripResponse {
    private UUID tripId;
    private UUID busId;
    private String busRegistrationNumber;
    private UUID routeId;
    private String routeName;
    private UUID driverId;
    private OffsetDateTime departureTime;
    private int expectedDurationMin;
    private int availableSeats;
    private BigDecimal estimatedPrice;
    private TripStatus status;
    private int seatsGenerated;
    private Instant createdAt;
}
