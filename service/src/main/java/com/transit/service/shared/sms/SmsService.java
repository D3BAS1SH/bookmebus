package com.transit.service.shared.sms;

/**
 * Contract for SMS delivery.
 *
 * The stub implementation logs the message.
 * To wire a real provider, implement this interface, annotate with @Service @Primary,
 * and set app.sms.enabled=true in application.yml.
 *
 * Supported adapters (see SmsServiceImpl):
 *   - Stub     → logs, never calls external API (default, safe for dev/test)
 *   - Fast2SMS → Indian transactional SMS via fast2sms.com
 *   - Twilio   → Global SMS via twilio.com
 */
public interface SmsService {

    /**
     * Send an SMS message.
     *
     * @param phoneNumber recipient phone number in E.164 format (+91XXXXXXXXXX)
     * @param message     plain text body (keep under 160 chars for single-part SMS)
     */
    void send(String phoneNumber, String message);

}
