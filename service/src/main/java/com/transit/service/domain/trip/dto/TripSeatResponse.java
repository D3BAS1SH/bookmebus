package com.transit.service.domain.trip.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TripSeatResponse {
    private UUID tripId;
    private UUID tripSeatId;
    private String seatNumber;
}
