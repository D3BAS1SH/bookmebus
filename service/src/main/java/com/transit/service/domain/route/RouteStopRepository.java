package com.transit.service.domain.route;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RouteStopRepository extends JpaRepository<RouteStop, UUID> {
    List<RouteStop> findByRoute_RouteIdOrderBySequenceOrderAsc(UUID routeId);

    // Used in Phase 3 booking — get a specific stop's distance for price calc
    Optional<RouteStop> findByRoute_RouteIdAndLocation_LocationId(UUID routeId, UUID locationId);

    // Used in Phase 3 overlap check
    boolean existsByRoute_RouteIdAndLocation_LocationId(UUID routeId, UUID locationId);
}
