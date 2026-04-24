package com.transit.service.domain.booking.dto;

import com.transit.service.domain.booking.BookingStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DriverPassengerView {
    private String travelerName;
    private String seatNumber;
    private String boardingStop;
    private String dropoffStop;
    private boolean didBoard;
    private BookingStatus bookingStatus;
}
