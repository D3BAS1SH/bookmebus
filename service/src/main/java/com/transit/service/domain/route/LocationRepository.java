package com.transit.service.domain.route;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface LocationRepository extends JpaRepository<Location, UUID> {
    boolean existsByLocationNameIgnoreCase(String locationName);
    boolean existsById(UUID id);
}
