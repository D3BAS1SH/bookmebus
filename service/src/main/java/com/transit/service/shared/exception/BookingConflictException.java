package com.transit.service.shared.exception;

/**
 * Thrown when a traveler tries to book a seat that overlaps
 * with an existing confirmed booking on the same segment.
 * <p>
 * The overlap check query in {@code BookingServiceImpl} throws this.
 * GlobalExceptionHandler catches it and returns HTTP 409 Conflict.
 * </p>
 * <b>Usage:</b>
 * <ul>
 *   <li>{@code throw new BookingConflictException("14A", boardingSeq, dropoffSeq);}</li>
 * </ul>
 */
public class BookingConflictException extends RuntimeException {

    public BookingConflictException(String seatNumber, int boardingSeq, int dropoffSeq) {
        super("Seat " + seatNumber + " is already booked for the segment between stops "
                + boardingSeq + " and " + dropoffSeq
                + ". Please choose a different seat or adjust your journey segment.");
    }

    /**
     * Generic version when seat number isn't available at the throw site
     */
    public BookingConflictException(String message) {
        super(message);
    }
}