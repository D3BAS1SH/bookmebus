package com.transit.service.domain.route.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class RouteStopResponse {
    private UUID routeStopId;
    private UUID routeId;
    private UUID locationId;
    private String locationName;
    private Integer sequenceOrder;
    private BigDecimal distanceFromOrigin;
    private boolean isBoardingPoint;
    private boolean isDroppingPoint;
}
