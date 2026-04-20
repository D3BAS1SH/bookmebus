package com.transit.service.shared.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "application.ticket")
@Getter
@Setter
public class TicketProperties {
    /**
     * Base directory where QR code PNG files are stored.
     * Example: /var/transit/tickets/qr
     */
    private String qrStoragePath = "tickets/qr";

    /**
     * Base directory where PDF ticket files are stored.
     * Example: /var/transit/tickets/pdf
     */
    private String pdfStoragePath = "tickets/pdf";

    /**
     * QR code image width in pixels.
     */
    private int qrWidth = 250;

    /**
     * QR code image height in pixels.
     */
    private int qrHeight = 250;
}
