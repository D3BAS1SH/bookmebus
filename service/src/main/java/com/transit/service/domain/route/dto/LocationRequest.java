package com.transit.service.domain.route.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class LocationRequest {

    @NotBlank
    private String locationName;

    @NotNull
    private BigDecimal latitude;

    @NotNull
    private BigDecimal longitude;
}
