package com.transit.service.domain.route;

import com.transit.service.domain.route.dto.LocationRequest;
import com.transit.service.domain.route.dto.LocationResponse;
import com.transit.service.domain.route.dto.LocationUpdateRequest;

import java.util.List;
import java.util.UUID;

public interface LocationService {
    List<LocationResponse> getAllLocationOfRoute(UUID routeId);
    List<LocationResponse> getAllLocation();
    LocationResponse getLocation(UUID locationId);
    LocationResponse addLocation(LocationRequest locationRequest);
    LocationResponse updateLocation(UUID locationId, LocationUpdateRequest locationRequest);
    void deleteLocation(UUID locationId);
}
