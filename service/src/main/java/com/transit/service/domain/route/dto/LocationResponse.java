package com.transit.service.domain.route.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class LocationResponse {
    private UUID locationId;
    private String locationName;
    private BigDecimal latitude;
    private BigDecimal longitude;
}
