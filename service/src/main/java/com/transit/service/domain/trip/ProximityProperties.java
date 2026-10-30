package com.transit.service.domain.trip;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Binds all app.proximity.* properties from application.yml.
 *
 * app:
 *   proximity:
 *     avg-speed-kmh: 40
 *     notify-window-min-minutes: 60
 *     notify-window-max-minutes: 120
 *     sms-guard-ttl-seconds: 14400
 */
@Component
@ConfigurationProperties(prefix = "application.proximity")
@Getter
@Setter
public class ProximityProperties {
    /**
     * Assumed average bus speed in km/h.
     * ETA (minutes) = (distance_km / avgSpeedKmh) * 60
     */
    private double avgSpeedKmh = 40.0;

    /**
     * Lower bound of the notification window (inclusive).
     * Notify when ETA >= notifyWindowMinMinutes.
     */
    private int notifyWindowMinMinutes = 60;

    /**
     * Upper bound of the notification window (inclusive).
     * Notify when ETA <= notifyWindowMaxMinutes.
     */
    private int notifyWindowMaxMinutes = 120;

    /**
     * TTL in seconds for the Redis guard key that prevents duplicate SMS.
     * Default: 14400 = 4 hours.
     */
    private long smsGuardTtlSeconds = 14400L;
}
