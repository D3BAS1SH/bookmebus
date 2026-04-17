package com.transit.service.domain.route;

import com.transit.service.domain.route.dto.RouteRequest;
import com.transit.service.domain.route.dto.RouteResponse;
import com.transit.service.domain.route.dto.RouteStopRequest;
import com.transit.service.domain.route.dto.RouteStopResponse;
import com.transit.service.domain.user.User;
import com.transit.service.domain.user.UserRepository;
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
public class RouteServiceImpl implements RouteService{
    private final RouteRepository routeRepository;
    private final RouteStopRepository routeStopRepository;
    private final LocationRepository locationRepository;
    private final UserRepository userRepository;

    @Override
    public RouteResponse createRoute(RouteRequest routeRequest, UUID ownerId) {
        User owner = userRepository.findById(ownerId).orElseThrow(()-> new ResourceNotFoundException("User","id",ownerId));
        Route route = Route.builder()
                .owner(owner)
                .routeName(routeRequest.getRouteName())
                .stops(new ArrayList<>())
                .build();
        for(RouteStopRequest routeStopRequest : routeRequest.getRouteStops() ){
            Location location = this.locationRepository
                    .findById(routeStopRequest.getLocationId())
                    .orElseThrow(
                            ()-> new ResourceNotFoundException("Location","id",routeStopRequest.getLocationId())
                    );
            RouteStop stop = RouteStop.builder()
                    .route(route)
                    .location(location)
                    .sequenceOrder(routeStopRequest.getSequenceOrder())
                    .distanceFromOrigin(routeStopRequest.getDistanceFromOrigin())
                    .isBoardingPoint(routeStopRequest.isBoardingPoint())
                    .isDroppingPoint(routeStopRequest.isDroppingPoint())
                    .build();
            route.getStops().add(stop);
        }
        Route saved = this.routeRepository.save(route);
        log.info("Route created: {} by owner: {}", saved.getRouteId(), ownerId);
        return toResponse(saved);
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
