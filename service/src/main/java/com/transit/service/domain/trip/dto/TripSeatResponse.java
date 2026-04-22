package com.transit.service.domain.trip.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TripSeatResponse {
    private UUID tripId;
    private UUID tripSeatId;
    private String seatNumber;

    /**
     * Availability status for this seat.
     *
     * Segment mode  (boardingStopId + dropoffStopId provided):
     *   AVAILABLE or BOOKED — precise answer for the requested segment.
     *
     * General mode (no segment params):
     *   AVAILABLE        — seat has zero confirmed bookings anywhere on the route.
     *   PARTIALLY_BOOKED — seat has at least one confirmed booking somewhere,
     *                      but may still be bookable for other segments.
     */
    private SeatStatus seatStatus;

    /**
     * Only populated in general mode (no segment params).
     * Shows every confirmed booking segment on this seat so the
     * owner/driver can see exactly which parts of the route are occupied.
     *
     * Example: [{ boardingSeq: 1, dropoffSeq: 3, boardingStop: "Bhubaneswar",
     *              dropoffStop: "Cuttack" }]
     *
     * Empty list in segment mode — unnecessary data when you already have AVAILABLE/BOOKED.
     */
    private List<BookedSegmentInfo> bookedSegments;

    @Data
    @Builder
    public static class BookedSegmentInfo {
        private int boardingSeq;
        private int dropoffSeq;
        private String boardingStopName;
        private String dropoffStopName;
    }
}
