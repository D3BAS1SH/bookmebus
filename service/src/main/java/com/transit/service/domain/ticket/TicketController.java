package com.transit.service.domain.ticket;

import com.transit.service.domain.booking.dto.BookingResponse;
import com.transit.service.domain.user.User;
import com.transit.service.shared.exception.BusinessException;
import com.transit.service.shared.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/ticket")
@RequiredArgsConstructor
@Slf4j
public class TicketController {

    private final TicketService ticketService;

    /**
     * POST /api/v1/tickets/{bookingId}
     *
     * [F-07] Generate QR + PDF for a confirmed booking.
     * Called by the TRAVELER after createBooking returns.
     * Idempotent — safe to call multiple times.
     */
    @PostMapping("/{bookingId}")
    @PreAuthorize("hasAnyRole('TRAVELER', 'OWNER')")
    public ResponseEntity<ApiResponse<BookingResponse>> generateTicket(
            @PathVariable UUID bookingId,
            @AuthenticationPrincipal User caller
    ) {
        log.info("Ticket generation requested: bookingId={} caller={}", bookingId, caller.getId());
        return ResponseEntity.ok(ApiResponse.ok(ticketService.generateTicket(bookingId)));
    }

    /**
     * GET /api/v1/tickets/{bookingId}/download
     *
     * Streams the PDF ticket as an attachment.
     * TRAVELER downloads their own ticket; DRIVER/OWNER may also access.
     */
    @GetMapping("/{bookingId}/download")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Resource> downloadTicket(@PathVariable UUID bookingId) {
        log.info("Ticket download requested: bookingId={}", bookingId);

        String pdfPath = ticketService.getTicketPdfPath(bookingId);
        File pdfFile = new File(pdfPath);

        if (!pdfFile.exists()) {
            throw new BusinessException("Ticket file not found on disk. Please regenerate.");
        }

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"ticket_" + bookingId + ".pdf\"")
                .body(new FileSystemResource(pdfFile));
    }

    /**
     * GET /api/v1/tickets/resolve?code={bookingCode}
     *
     * [F-08] Driver QR scan flow — step 1 of 2.
     *
     * The QR code contains only the 8-char bookingCode. The driver app scans it,
     * calls this endpoint to get the full BookingResponse (including bookingId),
     * then calls PATCH /api/v1/bookings/{bookingId}/board to mark boarding.
     *
     * This two-step design keeps BookingController consistent (UUID path variables
     * everywhere) while allowing QR codes to be short and human-readable.
     *
     * Access: DRIVER only
     */
    @GetMapping("/resolve")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<ApiResponse<BookingResponse>> resolveByCode(
            @RequestParam("code") String bookingCode,
            @AuthenticationPrincipal User caller
    ) {
        log.info("Driver {} resolving booking code {}", caller.getId(), bookingCode);
        return ResponseEntity.ok(ApiResponse.ok(ticketService.resolveByCode(bookingCode)));
    }
}
