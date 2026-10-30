package com.transit.service.domain.route;

import com.transit.service.domain.route.dto.RouteRequest;
import com.transit.service.domain.route.dto.RouteResponse;
import com.transit.service.domain.route.dto.RouteStopRequest;

import java.util.List;
import java.util.UUID;

public interface RouteService {
    RouteResponse createRoute(RouteRequest routeRequest, UUID ownerId);
    RouteResponse getRoute(UUID routeId);
    List<RouteResponse> getOwnerRoutes(UUID ownerId);
    RouteResponse addStop(UUID routeId, RouteStopRequest routeStopRequest);
    RouteResponse removeStop(UUID routeId, UUID routeStopId);
    void deleteRoute(UUID ownerId,UUID routeId);
}
