package com.transit.service.shared.sms;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

/**
 * SMS delivery implementation.
 *
 * Behavior is controlled by app.sms.enabled and app.sms.provider:
 *
 *   enabled=false (any provider) → STUB: logs message, no HTTP call.
 *                                   Safe for local dev and tests.
 *
 *   enabled=true, provider=fast2sms → calls Fast2SMS transactional API
 *   enabled=true, provider=twilio   → calls Twilio Messages API
 *
 * To add a new provider (e.g., MSG91, AWS SNS):
 *   1. Add properties to SmsProperties
 *   2. Add a new case in the switch below
 *   3. Implement a private sendVia*() method following the same pattern
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SmsServiceImpl implements SmsService {
    private final SmsProperties smsProperties;

    // Reusable HTTP client (Java 11+ built-in, no extra dep needed)
    private final HttpClient httpClient = HttpClient.newHttpClient();

    @Override
    public void send(String phoneNumber, String message) {
        if (!smsProperties.isEnabled()) {
            // Stub mode — log at INFO so it's visible in dev logs
            log.info("[SMS-STUB] To: {} | Message: {}", phoneNumber, message);
            return;
        }

        String provider = smsProperties.getProvider();

        switch (provider) {
            case "fast2sms" -> sendViaFast2Sms(phoneNumber, message);
            case "twilio"   -> sendViaTwilio(phoneNumber, message);
            default -> {
                log.warn("[SMS] Unknown provider '{}' — falling back to stub log", provider);
                log.info("[SMS-STUB] To: {} | Message: {}", phoneNumber, message);
            }
        }
    }

    // -------------------------------------------------------------------------
    // Fast2SMS adapter
    // Docs: https://docs.fast2sms.com/#send-message-using-quick-transactional-route
    // -------------------------------------------------------------------------
    private void sendViaFast2Sms(String phoneNumber, String message) {
        try {
            // Strip country code prefix for Fast2SMS (expects 10-digit Indian numbers)
            String number = phoneNumber.startsWith("+91")
                    ? phoneNumber.substring(3)
                    : phoneNumber;

            String url = "https://www.fast2sms.com/dev/bulkV2"
                    + "?authorization=" + smsProperties.getFast2sms().getApiKey()
                    + "&route="         + smsProperties.getFast2sms().getRoute()
                    + "&message="       + URLEncoder.encode(message, StandardCharsets.UTF_8)
                    + "&numbers="       + number;

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .GET()
                    .build();

            HttpResponse<String> response =
                    httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                log.info("[SMS-Fast2SMS] Sent to {} | status=200", phoneNumber);
            } else {
                log.error("[SMS-Fast2SMS] Failed to send to {} | status={} | body={}",
                        phoneNumber, response.statusCode(), response.body());
            }

        } catch (IOException | InterruptedException ex) {
            log.error("[SMS-Fast2SMS] Exception sending to {}: {}", phoneNumber, ex.getMessage());
            Thread.currentThread().interrupt();
        }
    }

    // -------------------------------------------------------------------------
    // Twilio adapter
    // Docs: https://www.twilio.com/docs/sms/api/message-resource#create-a-message-resource
    // -------------------------------------------------------------------------
    private void sendViaTwilio(String phoneNumber, String message) {
        try {
            SmsProperties.Twilio cfg = smsProperties.getTwilio();

            String body = "To="     + URLEncoder.encode(phoneNumber, StandardCharsets.UTF_8)
                    + "&From="      + URLEncoder.encode(cfg.getFromNumber(), StandardCharsets.UTF_8)
                    + "&Body="      + URLEncoder.encode(message, StandardCharsets.UTF_8);

            String url = "https://api.twilio.com/2010-04-01/Accounts/"
                    + cfg.getAccountSid() + "/Messages.json";

            // Twilio uses HTTP Basic Auth: accountSid:authToken
            String credentials = cfg.getAccountSid() + ":" + cfg.getAuthToken();
            String encodedCredentials = java.util.Base64.getEncoder()
                    .encodeToString(credentials.getBytes(StandardCharsets.UTF_8));

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Authorization", "Basic " + encodedCredentials)
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();

            HttpResponse<String> response =
                    httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 201) {
                log.info("[SMS-Twilio] Sent to {} | status=201", phoneNumber);
            } else {
                log.error("[SMS-Twilio] Failed to send to {} | status={} | body={}",
                        phoneNumber, response.statusCode(), response.body());
            }

        } catch (IOException | InterruptedException ex) {
            log.error("[SMS-Twilio] Exception sending to {}: {}", phoneNumber, ex.getMessage());
            Thread.currentThread().interrupt();
        }
    }
}
