package com.transit.service.domain.trip;

import com.transit.service.domain.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TripRepository extends JpaRepository<Trip, UUID> {

    Page<Trip> findByDriver(User driver, Pageable pageable);

    @Query("""
        SELECT t FROM Trip t
        WHERE t.route.routeId = :routeId
        AND CAST(t.departureTime AS LocalDate) = :date
        AND t.status = 'SCHEDULED'
        ORDER BY t.departureTime ASC
    """)
    Page<Trip> searchByRouteAndDate(
            @Param("routeId") UUID routeId,
            @Param("date") LocalDate date,
            Pageable pageable
    );

    @Query("SELECT t FROM Trip t WHERE t.bus.owner.id = :ownerId")
    Page<Trip> findByOwnerId(@Param("ownerId") UUID ownerId, Pageable pageable);

    @Query("""
        SELECT t FROM Trip t
        JOIN FETCH t.bus b
        JOIN FETCH b.owner
        JOIN FETCH t.route
        JOIN FETCH t.driver
        WHERE t.tripId = :tripId
    """)
    Optional<Trip> findByIdWithDetails(@Param("tripId") UUID tripId);

    /**
     * Returns all trips currently IN_TRANSIT.
     * Used by ProximityScheduler every 60s to find active trips.
     * Spring Data derives the query automatically from the method name.
     */
    @Query(
            value = "SELECT * FROM trip WHERE status = CAST(:status AS trip_status)",
            nativeQuery = true
    )
    List<Trip> findByStatus(@Param("status") String status);

    @Query(value = """
        SELECT DISTINCT t FROM Trip t
        JOIN FETCH t.bus b
        JOIN FETCH b.owner
        JOIN FETCH t.route r
        JOIN FETCH t.driver
        JOIN RouteStop rs1 ON rs1.route = r
        JOIN RouteStop rs2 ON rs2.route = r
        WHERE rs1.location.locationId = :originId
        AND rs2.location.locationId = :destinationId
        AND rs1.sequenceOrder < rs2.sequenceOrder
        AND rs1.boardingPoint = true
        AND rs2.droppingPoint = true
        AND CAST(t.departureTime AS LocalDate) = :date
        AND t.status = 'SCHEDULED'
        ORDER BY t.departureTime ASC
    """,
    countQuery = """
        SELECT COUNT(DISTINCT t) FROM Trip t
        JOIN t.route r
        JOIN RouteStop rs1 ON rs1.route = r
        JOIN RouteStop rs2 ON rs2.route = r
        WHERE rs1.location.locationId = :originId
        AND rs2.location.locationId = :destinationId
        AND rs1.sequenceOrder < rs2.sequenceOrder
        AND rs1.boardingPoint = true
        AND rs2.droppingPoint = true
        AND CAST(t.departureTime AS LocalDate) = :date
        AND t.status = 'SCHEDULED'
    """)
    Page<Trip> searchByOriginAndDestination(
            @Param("originId") UUID originId,
            @Param("destinationId") UUID destinationId,
            @Param("date") LocalDate date,
            Pageable pageable
    );
}
