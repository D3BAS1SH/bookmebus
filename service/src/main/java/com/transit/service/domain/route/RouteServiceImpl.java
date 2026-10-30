package com.transit.service.domain.route;

import com.transit.service.domain.route.dto.RouteRequest;
import com.transit.service.domain.route.dto.RouteResponse;
import com.transit.service.domain.route.dto.RouteStopRequest;
import com.transit.service.domain.route.dto.RouteStopResponse;
import com.transit.service.domain.user.User;
import com.transit.service.domain.user.UserRepository;
import com.transit.service.shared.exception.ResourceNotFoundException;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class RouteServiceImpl implements RouteService {

    @PersistenceContext
    private EntityManager entityManager;

    private final RouteRepository routeRepository;
    private final RouteStopRepository routeStopRepository;
    private final LocationRepository locationRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public RouteResponse createRoute(RouteRequest routeRequest, UUID ownerId) {
        User owner = this.userRepository.findById(ownerId).orElseThrow(()-> new ResourceNotFoundException("User","id",ownerId));
        Route route = Route.builder()
                .owner(owner)
                .routeName(routeRequest.getRouteName())
                .stops(new ArrayList<>())
                .build();
        // Get all locations Ids
        List<UUID> locationIds = routeRequest.getRouteStops().stream().map(RouteStopRequest::getLocationId).toList();

        // Get Locations from locationIds
        List<Location> locations = this.locationRepository.findAllById(locationIds);

        Map<UUID,Location> locationMap = locations.stream().collect(Collectors.toMap(Location::getLocationId,location -> location));

        for(RouteStopRequest routeStopRequest : routeRequest.getRouteStops() ){
            Location location = locationMap.get(routeStopRequest.getLocationId());
            log.debug("Boarding Point: "+routeStopRequest.isBoardingPoint(),routeStopRequest.isBoardingPoint());
            if(location == null){
                throw new ResourceNotFoundException("Location","id",routeStopRequest.getLocationId());
            }

            RouteStop stop = RouteStop.builder()
                    .route(route)
                    .location(location)
                    .sequenceOrder(routeStopRequest.getSequenceOrder())
                    .distanceFromOrigin(routeStopRequest.getDistanceFromOrigin())
                    .boardingPoint(routeStopRequest.isBoardingPoint())
                    .droppingPoint(routeStopRequest.isDroppingPoint())
                    .build();

            route.getStops().add(stop);
        }
        Route saved = this.routeRepository.save(route);
        log.info("Route created: {} by owner: {}", saved.getRouteId(), ownerId);
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public RouteResponse getRoute(UUID routeId){
        Route route = this.routeRepository.findById(routeId).orElseThrow(()-> new ResourceNotFoundException("Route","id",routeId));
        return toResponse(route);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RouteResponse> getOwnerRoutes(UUID ownerId) {
        List<Route> routes = this.routeRepository.findByOwner_id(ownerId);
        if(routes.isEmpty()){ return new ArrayList<>(); }
        List<RouteResponse> routeResponses = new ArrayList<>();
        for (Route route : routes) {
            routeResponses.add(toResponse(route));
        }
        return routeResponses;
    }

    @Override
    @Transactional
    public RouteResponse addStop(UUID routeId, RouteStopRequest routeStopRequest){

        Location location = this.locationRepository.findById(routeStopRequest.getLocationId())
                .orElseThrow(()-> new ResourceNotFoundException("Location","id",routeStopRequest.getLocationId()));

        if(!this.routeRepository.existsById(routeId)){
            throw new ResourceNotFoundException("Route","id",routeId);
        }

        /**
         * Shift existing sequences to make room for the new stop
         * NOTE: Because of `clearAutomatically = true` in the repository,
         * this clears Hibernate's cache so we don't accidentally save stale data.
         */
        this.routeStopRepository.shiftSequencesDown(routeId, routeStopRequest.getSequenceOrder());

        this.entityManager.flush();

        Route routeProxy = this.routeRepository.getReferenceById(routeId);
        RouteStop newStop = RouteStop.builder()
                .route(routeProxy)
                .location(location)
                .sequenceOrder(routeStopRequest.getSequenceOrder())
                .distanceFromOrigin(routeStopRequest.getDistanceFromOrigin())
                .boardingPoint(routeStopRequest.isBoardingPoint())
                .droppingPoint(routeStopRequest.isDroppingPoint())
                .build();
        this.routeStopRepository.save(newStop);
        Route udpatedRoute = this.routeRepository.findById(routeId).orElseThrow(()-> new ResourceNotFoundException("Route","id",routeId));
        return toResponse(udpatedRoute);
    }

    @Override
    @Transactional
    public RouteResponse removeStop(UUID routeId, UUID routeStopId){
        RouteStop routeStopToDelete = this.routeStopRepository.findById(routeStopId).orElseThrow(()-> new ResourceNotFoundException("RouteStop","id",routeStopId));
        if(!routeStopToDelete.getRoute().getRouteId().equals(routeId)){
            throw new IllegalArgumentException("This RouteStop does not belong to the specified Route");
        }
        int sequenceToDelete = routeStopToDelete.getSequenceOrder();
        this.routeStopRepository.delete(routeStopToDelete);
        this.routeStopRepository.flush();
        this.routeStopRepository.shiftSequencesUp(routeId, sequenceToDelete);
        Route updatedRoute = this.routeRepository.findById(routeId).orElseThrow(()-> new ResourceNotFoundException("Route","id",routeId));
        return toResponse(updatedRoute);
    }

    @Override
    public void deleteRoute(UUID ownerId, UUID routeId){
        if (!this.routeRepository.existsByRouteIdAndOwner_Id(routeId, ownerId)) {
            throw new IllegalArgumentException("Route not found or does not belong to you");
        }
        this.routeRepository.deleteById(routeId);
    }

    // Private helpers

    private RouteResponse toResponse(Route route) {
        List<RouteStopResponse> stopResponses = route.getStops().stream()
                .map(s -> RouteStopResponse.builder()
                        .routeStopId(s.getRouteStopId())
                        .locationId(s.getLocation().getLocationId())
                        .locationName(s.getLocation().getLocationName())
                        .sequenceOrder(s.getSequenceOrder())
                        .distanceFromOrigin(s.getDistanceFromOrigin())
                        .isBoardingPoint(s.isBoardingPoint())
                        .isDroppingPoint(s.isDroppingPoint())
                        .build())
                .toList();

        return RouteResponse.builder()
                .routeId(route.getRouteId())
                .routeName(route.getRouteName())
                .ownerId(route.getOwner().getId())
                .stops(stopResponses)
                .createdAt(route.getCreatedAt())
                .build();
    }
}
