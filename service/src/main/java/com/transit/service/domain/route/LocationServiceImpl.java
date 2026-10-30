package com.transit.service.domain.route;

import com.transit.service.domain.route.dto.LocationRequest;
import com.transit.service.domain.route.dto.LocationResponse;
import com.transit.service.domain.route.dto.LocationUpdateRequest;
import com.transit.service.shared.exception.DuplicateResourceException;
import com.transit.service.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class LocationServiceImpl implements LocationService{
    private final LocationRepository locationRepository;
    private final RouteRepository routeRepository;
    private final RouteStopRepository routeStopRepository;

    @Override
    @Transactional
    public LocationResponse addLocation(LocationRequest locationRequest){
        if(this.locationRepository.existsByLocationNameIgnoreCase(locationRequest.getLocationName())){
            throw new DuplicateResourceException("Location with name " + locationRequest.getLocationName() + " already exists");
        }
        Location newLocation = Location.builder()
                .locationName(locationRequest.getLocationName())
                .longitude(locationRequest.getLongitude())
                .latitude(locationRequest.getLatitude())
                .build();
        Location savedLocation = this.locationRepository.save(newLocation);

        return this.toResponse(savedLocation);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LocationResponse> getAllLocation() {

        List<Location> allLocations = this.locationRepository.findAll();

        return allLocations.stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public LocationResponse getLocation(UUID locationId){
        Location specificLocation = this.locationRepository.findById(locationId).orElseThrow(()-> new ResourceNotFoundException("location","id",locationId));
        return this.toResponse(specificLocation);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LocationResponse> getAllLocationOfRoute(UUID routeId){
        if (!this.routeRepository.existsById(routeId)) {
            throw new ResourceNotFoundException("Route", "id", routeId);
        }
        List<Location> orderedLocations = this.locationRepository.findLocationsByRouteIdOrdered(routeId);
        return orderedLocations.stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional
    public LocationResponse updateLocation(UUID locationId, LocationUpdateRequest locationRequest){
        Location locationToUpdate = this.locationRepository.findById(locationId).orElseThrow(()-> new ResourceNotFoundException("location","id",locationId));
        if(!locationToUpdate.getLocationName().equalsIgnoreCase(locationRequest.getLocationName())){
            if (this.locationRepository.existsByLocationNameIgnoreCase(locationRequest.getLocationName())) {
                throw new DuplicateResourceException("Location with name " + locationRequest.getLocationName() + " already exists");
            }
            locationToUpdate.setLocationName(locationRequest.getLocationName());
        }
        if (locationRequest.getLatitude() != null) {
            locationToUpdate.setLatitude(locationRequest.getLatitude());
        }
        if (locationRequest.getLongitude() != null) {
            locationToUpdate.setLongitude(locationRequest.getLongitude());
        }
        return this.toResponse(locationToUpdate);
    }

    @Override
    @Transactional
    public void deleteLocation(UUID locationId){
        Location locationToDelete = this.locationRepository.findById(locationId).orElseThrow(()-> new ResourceNotFoundException("location","id",locationId));
        if(this.routeStopRepository.existsByLocation_LocationId(locationId)){
            throw new IllegalStateException("Cannot delete location: it is currently assigned as a stop on one or more routes.");
        }
        this.locationRepository.delete(locationToDelete);
    }

    // Private helper
    private LocationResponse toResponse(Location location){
        return LocationResponse.builder()
                .locationId(location.getLocationId())
                .locationName(location.getLocationName())
                .latitude(location.getLatitude())
                .longitude(location.getLongitude())
                .build();
    }
}
