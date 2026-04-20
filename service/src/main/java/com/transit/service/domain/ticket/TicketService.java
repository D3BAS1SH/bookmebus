package com.transit.service.domain.ticket;

import com.transit.service.domain.booking.dto.BookingResponse;

import java.util.UUID;

public interface TicketService {
    /**
     * [F-07] Generates QR code (ZXing) + PDF ticket (iText 7) for the given booking.
     * Saves both files to disk and persists their paths back into Booking.
     * Idempotent — if paths already set, returns immediately without regenerating.
     *
     * @param bookingId UUID of the confirmed booking
     * @return BookingResponse with qrCodePath and ticketPdfPath populated
     */
    BookingResponse generateTicket(UUID bookingId);

    /**
     * Returns the absolute filesystem path of the PDF ticket.
     * Used by the download endpoint to stream the file.
     *
     * @param bookingId UUID of the booking
     * @return absolute path string of the PDF
     * @throws com.transit.service.shared.exception.BusinessException if ticket not yet generated
     */
    String getTicketPdfPath(UUID bookingId);

    /**
     * [F-08] Resolves an 8-char bookingCode (from QR scan) to a BookingResponse.
     * The driver app scans the QR, reads the bookingCode, calls this endpoint
     * to get the bookingId, then calls PATCH /api/v1/bookings/{bookingId}/board.
     *
     * @param bookingCode the 8-char code embedded in the QR
     * @return BookingResponse including bookingId and current didBoard state
     */
    BookingResponse resolveByCode(String bookingCode);
}
