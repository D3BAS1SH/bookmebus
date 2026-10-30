package com.transit.service.shared.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
@ConfigurationProperties(prefix = "application.jwt")
@Getter
@Setter
public class JwtProperties {
    private String secretKey;
    private Duration accessTokenExpiry =  Duration.ofHours(24);
    private String issuer = "bookmebus";
}
