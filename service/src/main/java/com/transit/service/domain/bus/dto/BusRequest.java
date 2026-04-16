package com.transit.service.domain.bus.dto;

import com.transit.service.domain.bus.SeatLayoutConfig;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class BusRequest {

    @NotBlank(message = "Registration Number is required")
    @Size(max = 20, message = "Registration number must not exceed 20 characters")
    private String registrationNumber;

    @NotBlank(message = "Vehilce Number is required")
    @Size(max = 20, message = "Vehicle number must not exceed 20 characters")
    private String vehicleNumber;

    @NotNull(message = "Price per km is required")
    @DecimalMin(value = "0.01", message = "Price per km must be greater than 0")
    @Digits(integer = 8, fraction = 2, message = "Price per km must have at most 8 integer and 2 decimal digits")
    private BigDecimal pricePerKm;

    @NotNull(message = "Seat Layout config is required")
    private SeatLayoutConfig seatLayout;
}
