package com.transit.service.domain.bus.dto;

import com.transit.service.domain.bus.BusStatus;
import com.transit.service.domain.bus.SeatLayoutConfig;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
public class BusResponse {
    private UUID busId;
    private String registrationNumber;
    private String vehicleNumber;
    private BigDecimal pricePerKm;
    private SeatLayoutConfig seatLayout;
    private BusStatus status;
    private UUID ownerId;
    private String ownerEmail;
    private Instant createdAt;
    private Instant updatedAt;
}
