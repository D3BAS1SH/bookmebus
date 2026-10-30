package com.transit.service.domain.booking.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class BookingRequest {

    @NotNull(message = "Trip ID is required")
    private UUID tripId;

    @NotNull(message = "Seat ID is required")
    private UUID tripSeatId;

    @NotNull(message = "Boarding stop ID is required")
    private UUID boardingStopId;

    @NotNull(message = "Dropoff stop ID is required")
    private UUID dropoffStopId;
}
