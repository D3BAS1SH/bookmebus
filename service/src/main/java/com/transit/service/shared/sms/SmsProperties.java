package com.transit.service.shared.sms;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Binds all app.sms.* properties from application.yml.
 *
 * app:
 *   sms:
 *     enabled: false
 *     provider: stub          # stub | fast2sms | twilio
 *     fast2sms:
 *       api-key: ...
 *       route: q
 *     twilio:
 *       account-sid: ...
 *       auth-token: ...
 *       from-number: ...
 */
@Component
@ConfigurationProperties(prefix = "application.sms")
@Getter
@Setter
public class SmsProperties {
    /** When false, SmsServiceImpl logs instead of calling any external API. */
    private boolean enabled = false;

    /** Which adapter to activate: stub | fast2sms | twilio */
    private String provider = "stub";

    private Fast2Sms fast2sms = new Fast2Sms();
    private Twilio   twilio   = new Twilio();

    @Getter @Setter
    public static class Fast2Sms {
        private String apiKey;
        /** Route type: q = quick transactional, v = voice */
        private String route = "q";
    }

    @Getter @Setter
    public static class Twilio {
        private String accountSid;
        private String authToken;
        private String fromNumber;
    }
}
