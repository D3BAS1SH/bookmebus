package com.transit.service.domain.route;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RouteStopRepository extends JpaRepository<RouteStop, UUID> {
    List<RouteStop> findByRoute_RouteIdOrderBySequenceOrderAsc(UUID routeId);

    // Used in Phase 3 booking — get a specific stop's distance for price calc
    Optional<RouteStop> findByRoute_RouteIdAndLocation_LocationId(UUID routeId, UUID locationId);

    // Used in Phase 3 overlap check
    boolean existsByRoute_RouteIdAndLocation_LocationId(UUID routeId, UUID locationId);

    /**
     * Shifts the sequence order of existing stops down by 1 to make room for a new stop.
     * @param routeId The ID of the route
     * @param newSequence The sequence number where the new stop will be inserted
     */
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE RouteStop rs SET rs.sequenceOrder = rs.sequenceOrder + 1 " +
            "WHERE rs.route.routeId = :routeId AND rs.sequenceOrder >= :newSequence")
    void shiftSequencesDown(@Param("routeId") UUID routeId, @Param("newSequence") int newSequence);

    /**
     * Shifts the sequence order of existing stops up by 1 to make room for a new stop.
     * @param routeId The ID of the route
     * @param newSequence The sequence number where the new stop will be inserted
     */
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE RouteStop rs SET rs.sequenceOrder = rs.sequenceOrder - 1 " +
            "WHERE rs.route.routeId = :routeId AND rs.sequenceOrder > :newSequence")
    void shiftSequencesUp(@Param("routeId") UUID routeId, @Param("newSequence") int newSequence);

    /**
     * Checks if a specific location is currently being used as a stop in any route.
     * Used to prevent deleting locations that are in active use.
     * * @param locationId The ID of the location to check
     * @return true if the location is attached to at least one RouteStop, false otherwise
     */
    boolean existsByLocation_LocationId(UUID locationId);
}
