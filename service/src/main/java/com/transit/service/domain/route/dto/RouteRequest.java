package com.transit.service.domain.route.dto;

import com.transit.service.domain.route.RouteStop;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class RouteRequest {
    @NotBlank
    private String routeName;
    private List<RouteStopRequest>  routeStops;
}
