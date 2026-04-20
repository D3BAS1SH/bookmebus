package com.transit.service.domain.booking.dto;

import com.transit.service.domain.booking.BookingStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
public class BookingResponse {
    private UUID bookingId;
    private UUID tripId;
    private UUID userId;
    private UUID tripSeatId;
    private String seatNumber;

    private String boardingStopName;
    private String dropoffStopName;
    private int boardingSeq;
    private int dropoffSeq;

    private BigDecimal totalPrice;
    private String bookingCode;

    private BookingStatus status;
    private Instant bookedAt;
}
