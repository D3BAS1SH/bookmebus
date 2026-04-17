package com.transit.service.domain.route.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class RouteResponse {
    private UUID routeId;
    private String routeName;
    private UUID ownerId;
    private List<RouteStopResponse> stops;
    private Instant createdAt;
}
