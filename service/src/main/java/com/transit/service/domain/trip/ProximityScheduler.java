package com.transit.service.domain.trip;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.transit.service.domain.booking.Booking;
import com.transit.service.domain.booking.BookingRepository;
import com.transit.service.domain.trip.location.LocationMessage;
import com.transit.service.shared.sms.SmsService;
import com.transit.service.shared.util.HaversineUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.Duration;
import java.util.List;

/**
 * [F-10] Proximity Scheduler.
 *
 * Fires every 60 seconds. For every IN_TRANSIT trip:
 *   1. Reads the bus's latest GPS from Redis (set by LocationController)
 *   2. For each CONFIRMED booking on that trip:
 *        a. Computes Haversine distance: bus → traveler's boarding stop
 *        b. Estimates ETA = distance / avg_speed (minutes)
 *        c. If ETA is within [60, 120] min AND not yet notified:
 *             → Sends SMS to traveler
 *             → Sets Redis guard key (TTL 4h) to prevent duplicate SMS
 *
 * Redis keys used:
 *   trip:location:{tripId}        → latest LocationMessage JSON (written by LocationController)
 *   trip:sms:{tripId}:{bookingId} → "1" when SMS already sent (TTL = smsGuardTtlSeconds)
 *
 * Thread safety:
 *   fixedDelay (not fixedRate) guarantees next run starts only after the current
 *   run fully completes, so there's no risk of concurrent scheduler executions.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class ProximityScheduler {
    private static final String LOCATION_KEY_PREFIX  = "trip:location:";
    private static final String SMS_GUARD_KEY_PREFIX = "trip:sms:";

    private final TripRepository      tripRepository;
    private final BookingRepository   bookingRepository;
    private final StringRedisTemplate redisTemplate;
    private final SmsService          smsService;
    private final ProximityProperties proximityProperties;
    private final ObjectMapper        objectMapper;

    /**
     * Main scheduler tick — runs every 60 seconds after the previous execution completes.
     * @EnableScheduling must be present on any @Configuration class (or main class).
     */
    @Scheduled(fixedDelay = 60_000)
    public void checkProximity() {
        List<Trip> activeTrips = tripRepository.findByStatus(TripStatus.IN_TRANSIT.name());

        if (activeTrips.isEmpty()) {
            log.debug("ProximityScheduler: no IN_TRANSIT trips, skipping tick");
            return;
        }

        log.debug("ProximityScheduler: checking {} IN_TRANSIT trip(s)", activeTrips.size());

        for (Trip trip : activeTrips) {
            processTrip(trip);
        }
    }

    // -------------------------------------------------------------------------
    // Per-trip processing
    // -------------------------------------------------------------------------

    private void processTrip(Trip trip) {
        String tripId = trip.getTripId().toString();

        // 1. Read latest bus location from Redis
        String locationJson = redisTemplate.opsForValue().get(LOCATION_KEY_PREFIX + tripId);

        if (locationJson == null) {
            // Driver hasn't emitted yet for this trip — nothing to do
            log.debug("ProximityScheduler: no Redis location for tripId={}, skipping", tripId);
            return;
        }

        LocationMessage busLocation;
        try {
            busLocation = objectMapper.readValue(locationJson, LocationMessage.class);
        } catch (Exception ex) {
            log.error("ProximityScheduler: failed to deserialize location for tripId={}: {}",
                    tripId, ex.getMessage());
            return;
        }

        if (busLocation.getLatitude() == null || busLocation.getLongitude() == null) {
            log.warn("ProximityScheduler: null coordinates in Redis for tripId={}", tripId);
            return;
        }

        // 2. Fetch all CONFIRMED bookings for this trip
        List<Booking> bookings = bookingRepository.findConfirmedByTripId(trip.getTripId());

        if (bookings.isEmpty()) {
            return;
        }

        for (Booking booking : bookings) {
            processBooking(trip, booking, busLocation);
        }
    }

    private void processBooking(Trip trip, Booking booking, LocationMessage busLocation) {
        String tripId    = trip.getTripId().toString();
        String bookingId = booking.getBookingId().toString();

        // 3. Check guard — already notified this booking?
        String guardKey = SMS_GUARD_KEY_PREFIX + tripId + ":" + bookingId;
        Boolean alreadyNotified = redisTemplate.hasKey(guardKey);
        if (Boolean.TRUE.equals(alreadyNotified)) {
            log.debug("ProximityScheduler: SMS guard hit for bookingId={}, skipping", bookingId);
            return;
        }

        // 4. Get boarding stop coordinates
        //    booking.boardingPoint is a Location entity with latitude/longitude
        BigDecimal stopLat = booking.getBoardingPoint().getLatitude();
        BigDecimal stopLng = booking.getBoardingPoint().getLongitude();

        if (stopLat == null || stopLng == null) {
            log.warn("ProximityScheduler: boarding stop has null coordinates, bookingId={}", bookingId);
            return;
        }

        // 5. Compute Haversine distance (km) and ETA (minutes)
        double distanceKm = HaversineUtil.distanceKm(
                busLocation.getLatitude(), busLocation.getLongitude(),
                stopLat, stopLng
        );

        double etaMinutes = (distanceKm / proximityProperties.getAvgSpeedKmh()) * 60.0;

        log.debug("ProximityScheduler: bookingId={} distanceKm={} etaMinutes={}",
                bookingId, String.format("%.2f", distanceKm), String.format("%.1f", etaMinutes));

        // 6. Check if ETA is within the notification window [min, max]
        boolean inWindow = etaMinutes >= proximityProperties.getNotifyWindowMinMinutes()
                && etaMinutes <= proximityProperties.getNotifyWindowMaxMinutes();

        if (!inWindow) {
            return;
        }

        // 7. Send SMS
        String travelerPhone = booking.getTraveler().getPhone();
        String tripRoute     = trip.getRoute().getRouteName();   // assumes Route has getRouteName()
        String boardingStop  = booking.getBoardingPoint().getLocationName();
        int    etaRounded    = (int) Math.round(etaMinutes);

        String smsMessage = String.format(
                "Your bus on route '%s' is approximately %d minutes away from '%s'. Get ready!",
                tripRoute, etaRounded, boardingStop
        );

        try {
            smsService.send(travelerPhone, smsMessage);

            // 8. Set guard key so we don't SMS again this journey
            redisTemplate.opsForValue().set(
                    guardKey,
                    "1",
                    Duration.ofSeconds(proximityProperties.getSmsGuardTtlSeconds())
            );

            log.info("ProximityScheduler: SMS sent → phone={} tripId={} bookingId={} etaMin={}",
                    travelerPhone, tripId, bookingId, etaRounded);

        } catch (Exception ex) {
            // SMS failure must never crash the scheduler tick
            log.error("ProximityScheduler: SMS send failed for bookingId={}: {}",
                    bookingId, ex.getMessage());
        }
    }
}
