package com.transit.service.domain.route;

import com.transit.service.domain.route.dto.LocationRequest;
import com.transit.service.domain.route.dto.LocationResponse;

import java.util.List;
import java.util.UUID;

public interface LocationService {
    List<LocationResponse> getAllLocationOfRoute(UUID routeId);
    LocationResponse getLocation(UUID locationId);
    LocationResponse addLocation(LocationRequest locationRequest);
    LocationResponse updateLocation(UUID locationId,LocationRequest locationRequest);
    void deleteLocation(UUID locationId);
}
