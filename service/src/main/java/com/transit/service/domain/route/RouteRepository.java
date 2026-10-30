package com.transit.service.domain.route;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface RouteRepository extends JpaRepository<Route, UUID> {
    List<Route> findByOwner_id(UUID id);

    boolean existsByRouteIdAndOwner_Id(UUID routeId, UUID ownerId);
}
