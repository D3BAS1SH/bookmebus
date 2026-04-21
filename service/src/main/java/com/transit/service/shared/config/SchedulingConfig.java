package com.transit.service.shared.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Activates Spring's @Scheduled annotation processing.
 *
 * Without this, @Scheduled on ProximityScheduler will silently do nothing.
 *
 * Alternatively, add @EnableScheduling directly to your main Application class:
 *
 *   @SpringBootApplication
 *   @EnableScheduling
 *   public class TransitServiceApplication { ... }
 *
 * Either approach works — pick one, not both.
 */
@Configuration
@EnableScheduling
public class SchedulingConfig {
}
