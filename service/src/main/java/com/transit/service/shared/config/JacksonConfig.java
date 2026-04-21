package com.transit.service.shared.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Exposes a configured ObjectMapper bean so it can be injected anywhere
 * (LocationController, ProximityScheduler, etc.).
 *
 * Why this is needed:
 *   Spring Boot auto-configures an ObjectMapper internally for its MVC layer
 *   but does NOT register it as an injectable @Bean by default unless you
 *   set spring.mvc.converters.preferred-json-mapper=jackson (which is default
 *   in web apps) AND have no conflicting custom mapper.
 *   Declaring it explicitly here is the safest, most portable approach.
 *
 * Configuration:
 *   - JavaTimeModule: handles Java 8+ time types (Instant, OffsetDateTime, etc.)
 *   - WRITE_DATES_AS_TIMESTAMPS disabled: serializes Instant as ISO-8601 string
 *     instead of a numeric epoch — this is what LocationMessage.timestamp needs.
 */
@Configuration
public class JacksonConfig {
    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        return mapper;
    }
}
