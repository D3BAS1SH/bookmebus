package com.transit.service.domain.ticket;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.itextpdf.barcodes.qrcode.ErrorCorrectionLevel;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.HorizontalAlignment;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.transit.service.domain.booking.Booking;
import com.transit.service.domain.booking.BookingRepository;
import com.transit.service.domain.booking.dto.BookingResponse;
import com.transit.service.domain.route.RouteStopRepository;
import com.transit.service.shared.config.TicketProperties;
import com.transit.service.shared.exception.BusinessException;
import com.transit.service.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.format.DateTimeFormatter;
import java.util.EnumMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class TicketServiceImpl implements TicketService{

    private final BookingRepository bookingRepository;
    private final RouteStopRepository routeStopRepository;
    private final TicketProperties ticketProperties;

    private static final DateTimeFormatter DISPLAY_FORMAT =
            DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");

    @Override
    @Transactional
    public BookingResponse generateTicket(UUID bookingId) {
        Booking booking = findBooking(bookingId);

        // Idempotent — return early if already generated
        if (booking.getQrCodepath() != null && booking.getTicketPdfPath() != null) {
            log.info("Ticket already generated for booking {}", bookingId);
            return toResponse(booking);
        }

        try {
            String qrPath = generateQrCode(booking.getBookingCode());
            String pdfPath = generatePdf(booking, qrPath);

            booking.setQrCodepath(qrPath);
            booking.setTicketPdfPath(pdfPath);
            Booking saved = bookingRepository.save(booking);

            log.info("Ticket generated for booking {} — QR: {}, PDF: {}", bookingId, qrPath, pdfPath);
            return toResponse(saved);

        } catch (WriterException | IOException ex) {
            log.error("Ticket generation failed for booking {}: {}", bookingId, ex.getMessage(), ex);
            throw new BusinessException("Failed to generate ticket: " + ex.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public String getTicketPdfPath(UUID bookingId) {
        Booking booking = findBooking(bookingId);
        if (booking.getTicketPdfPath() == null) {
            throw new BusinessException("Ticket not yet generated for booking: " + bookingId);
        }
        return booking.getTicketPdfPath();
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponse resolveByCode(String bookingCode) {
        Booking booking = bookingRepository.findByBookingCode(bookingCode)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "bookingCode", bookingCode));
        return toResponse(booking);
    }

    // =========================================================================
    // QR Code — ZXing
    // =========================================================================

    private String generateQrCode(String bookingCode) throws WriterException, IOException {
        Map<EncodeHintType, Object> hints = new EnumMap<>(EncodeHintType.class);
        hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.H);
        hints.put(EncodeHintType.MARGIN, 1);

        QRCodeWriter writer = new QRCodeWriter();
        BitMatrix bitMatrix = writer.encode(
                bookingCode,
                BarcodeFormat.QR_CODE,
                ticketProperties.getQrWidth(),
                ticketProperties.getQrHeight(),
                hints
        );

        Path qrDir = Paths.get(ticketProperties.getQrStoragePath());
        Files.createDirectories(qrDir);

        // Filename includes a UUID suffix to avoid collisions on regeneration
        String filename = "qr_" + bookingCode + "_" + UUID.randomUUID().toString().substring(0, 8) + ".png";
        Path qrFile = qrDir.resolve(filename);
        MatrixToImageWriter.writeToPath(bitMatrix, "PNG", qrFile);

        log.debug("QR written to {}", qrFile.toAbsolutePath());
        return qrFile.toAbsolutePath().toString();
    }

    // =========================================================================
    // PDF — iText 7
    // =========================================================================

    private String generatePdf(Booking booking, String qrImagePath) throws IOException {
        Path pdfDir = Paths.get(ticketProperties.getPdfStoragePath());
        Files.createDirectories(pdfDir);

        String filename = "ticket_" + booking.getBookingCode() + ".pdf";
        Path pdfFile = pdfDir.resolve(filename);

        try (PdfWriter pdfWriter = new PdfWriter(pdfFile.toAbsolutePath().toString());
             PdfDocument pdfDoc = new PdfDocument(pdfWriter);
             Document document = new Document(pdfDoc, PageSize.A5)) {

            document.setMargins(30, 30, 30, 30);

            PdfFont bold = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);
            PdfFont regular = PdfFontFactory.createFont(StandardFonts.HELVETICA);
            DeviceRgb brandBlue = new DeviceRgb(30, 90, 160);
            DeviceRgb lightGray = new DeviceRgb(245, 245, 245);

            // Header
            document.add(new Paragraph("🚌  TransitPass")
                    .setFont(bold).setFontSize(20).setFontColor(brandBlue)
                    .setTextAlignment(TextAlignment.CENTER));
            document.add(new Paragraph("E-Ticket / Boarding Pass")
                    .setFont(regular).setFontSize(10).setFontColor(ColorConstants.GRAY)
                    .setTextAlignment(TextAlignment.CENTER).setMarginBottom(15));

            // Trip details — 2-column table
            Table table = new Table(UnitValue.createPercentArray(new float[]{40, 60}))
                    .setWidth(UnitValue.createPercentValue(100))
                    .setMarginBottom(15);

            // All field values read from actual Booking entity getters
            addRow(table, "Booking Code",    booking.getBookingCode(),                                         bold, regular, lightGray, true);
            addRow(table, "Route",           booking.getTrip().getRoute().getRouteName(),                      bold, regular, lightGray, false);
            addRow(table, "Departure",       DISPLAY_FORMAT.format(booking.getTrip().getDepartureTime()),      bold, regular, lightGray, true);
            addRow(table, "Seat",            booking.getTripSeat().getSeatNumber(),                            bold, regular, lightGray, false);
            addRow(table, "Boarding Stop",   booking.getBoardingPoint().getLocationName(),                     bold, regular, lightGray, true);
            addRow(table, "Dropoff Stop",    booking.getDropoffPoint().getLocationName(),                      bold, regular, lightGray, false);
            addRow(table, "Total Price",     "₹ " + booking.getTotalPrice(),                                   bold, regular, lightGray, true);
            addRow(table, "Passenger",       booking.getTraveler().getFullName(),                              bold, regular, lightGray, false);
            addRow(table, "Status",          booking.getBookingStatus().name(),                                 bold, regular, lightGray, true);

            document.add(table);

            // QR code
            document.add(new Paragraph("Scan for boarding verification")
                    .setFont(regular).setFontSize(9).setFontColor(ColorConstants.GRAY)
                    .setTextAlignment(TextAlignment.CENTER));

            document.add(new Image(ImageDataFactory.create(qrImagePath))
                    .setWidth(120).setHeight(120)
                    .setHorizontalAlignment(HorizontalAlignment.CENTER)
                    .setMarginTop(5));

            // Footer
            document.add(new Paragraph(
                    "System-generated ticket. Carry digital or printed copy for boarding.")
                    .setFont(regular).setFontSize(7).setFontColor(ColorConstants.GRAY)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginTop(20)
                    .setBorderTop(new SolidBorder(ColorConstants.LIGHT_GRAY, 0.5f))
                    .setPaddingTop(8));
        }

        log.debug("PDF written to {}", pdfFile.toAbsolutePath());
        return pdfFile.toAbsolutePath().toString();
    }

    // Private Helpers

    private void addRow(Table table, String label, String value,
                        PdfFont bold, PdfFont regular, DeviceRgb bgColor, boolean shaded) {
        Cell labelCell = new Cell()
                .add(new Paragraph(label).setFont(bold).setFontSize(9))
                .setBackgroundColor(shaded ? bgColor : ColorConstants.WHITE)
                .setPadding(6)
                .setBorder(new SolidBorder(ColorConstants.LIGHT_GRAY, 0.3f));
        Cell valueCell = new Cell()
                .add(new Paragraph(value != null ? value : "—").setFont(regular).setFontSize(9))
                .setBackgroundColor(shaded ? bgColor : ColorConstants.WHITE)
                .setPadding(6)
                .setBorder(new SolidBorder(ColorConstants.LIGHT_GRAY, 0.3f));
        table.addCell(labelCell);
        table.addCell(valueCell);
    }

    /**
     * Replicates BookingServiceImpl.toResponse() — TicketService returns BookingResponse
     * so the caller always gets fresh data including updated qrCodePath/ticketPdfPath.
     * There is no BookingMapper in this project; inline mapping is the convention.
     */
    private BookingResponse toResponse(Booking booking) {
        return BookingResponse.builder()
                .bookingId(booking.getBookingId())
                .tripId(booking.getTrip().getTripId())
                .userId(booking.getTraveler().getId())
                .tripSeatId(booking.getTripSeat().getTripSeatId())
                .seatNumber(booking.getTripSeat().getSeatNumber())
                .boardingStopName(booking.getBoardingPoint().getLocationName())
                .dropoffStopName(booking.getDropoffPoint().getLocationName())
                .boardingSeq(booking.getBoardingSequence())
                .dropoffSeq(booking.getDropoffSequence())
                .totalPrice(booking.getTotalPrice())
                .bookingCode(booking.getBookingCode())
                .qrCodePath(booking.getQrCodepath())
                .ticketPdfPath(booking.getTicketPdfPath())
                .didBoard(booking.isDidBoard())
                .status(booking.getBookingStatus())
                .bookedAt(booking.getBookingAt())
                .build();
    }

    private Booking findBooking(UUID bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));
    }
}
