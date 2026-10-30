package com.transit.service.shared.util;

import java.math.BigDecimal;

/**
 * Haversine formula — computes great-circle distance between two GPS coordinates.
 *
 * Result is in kilometres. Accuracy is well within 0.5% for distances up to
 * a few hundred km, which is more than sufficient for transit proximity checks.
 *
 * No external dependencies — pure Java math.
 *
 * Usage:
 *   double km = HaversineUtil.distanceKm(busLat, busLng, stopLat, stopLng);
 */
public final class HaversineUtil {
    private static final double EARTH_RADIUS_KM = 6371.0;

    // Utility class — no instances
    private HaversineUtil() {}

    /**
     * Compute the distance in kilometres between two points on Earth.
     *
     * @param lat1 latitude  of point 1 (degrees)
     * @param lng1 longitude of point 1 (degrees)
     * @param lat2 latitude  of point 2 (degrees)
     * @param lng2 longitude of point 2 (degrees)
     * @return distance in kilometres
     */
    public static double distanceKm(double lat1, double lng1,
                                    double lat2, double lng2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1))
                * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLng / 2) * Math.sin(dLng / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS_KM * c;
    }

    /**
     * Convenience overload accepting BigDecimal (matches Location entity fields).
     */
    public static double distanceKm(BigDecimal lat1, BigDecimal lng1,
                                    BigDecimal lat2, BigDecimal lng2) {
        return distanceKm(
                lat1.doubleValue(), lng1.doubleValue(),
                lat2.doubleValue(), lng2.doubleValue()
        );
    }
}
