package com.transit.service.domain.trip;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TripSeatRepository extends JpaRepository<TripSeat, UUID> {
    int countByTrip(Trip trip);
    List<TripSeat> findByTrip(Trip trip);
}
