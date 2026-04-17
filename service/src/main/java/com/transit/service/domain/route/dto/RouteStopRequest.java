package com.transit.service.domain.route.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class RouteStopRequest {
    @NotNull
    private UUID routeId;
    @NotNull
    private UUID locationId;
    @NotNull

    private Integer sequenceOrder;

    private BigDecimal distanceFromOrigin;
    private boolean isBoardingPoint;
    private boolean isDroppingPoint;
}
