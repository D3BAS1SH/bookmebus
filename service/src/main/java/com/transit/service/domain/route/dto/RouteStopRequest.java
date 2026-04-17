package com.transit.service.domain.route.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class RouteStopRequest {
    @NotNull
    private UUID locationId;
    @NotNull
    @Min(1)
    private Integer sequenceOrder;

    private BigDecimal distanceFromOrigin;
    private boolean isBoardingPoint;
    private boolean isDroppingPoint;
}
