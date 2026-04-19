package com.transit.service.domain.route;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface LocationRepository extends JpaRepository<Location, UUID> {
    boolean existsByLocationNameIgnoreCase(String locationName);
    boolean existsById(UUID id);

    @Query("SELECT rs.location FROM RouteStop rs WHERE rs.route.routeId = :routeId ORDER BY rs.sequenceOrder ASC")
    List<Location> findLocationsByRouteIdOrdered(@Param("routeId") UUID routeId);
}
