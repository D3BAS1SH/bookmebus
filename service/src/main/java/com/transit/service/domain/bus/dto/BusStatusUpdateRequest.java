package com.transit.service.domain.bus.dto;

import com.transit.service.domain.bus.BusStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class BusStatusUpdateRequest {

    @NotBlank(message = "Bus id is required")
    private UUID busId;

    @NotNull(message = "Bus status is required")
    private BusStatus busStatus;
}
