package com.transit.service.domain.route.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class LocationUpdateRequest {
    private String locationName;
    private BigDecimal latitude;
    private BigDecimal longitude;
}
