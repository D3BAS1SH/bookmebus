package com.transit.service.domain.bus;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BusRepository extends JpaRepository<Bus, UUID> {
    /** All buses belonging to this owner regardless of status */
    List<Bus> findAllByOwner_Id(UUID ownerId);

    /** Single bus scoped to owner — used for GET, PUT, PATCH */
    Optional<Bus> findByIdAndOwner_Id(UUID id, UUID ownerId);

    boolean existsByRegistrationNumber(String registrationNumber);

    boolean existsByVehicleNumber(String vehicleNumber);

    /** Uniqueness check excluding the bus being updated */
    boolean existsByRegistrationNumberAndIdNot(String registrationNumber, UUID id);

    boolean existsByVehicleNumberAndIdNot(String vehicleNumber, UUID id);
}
