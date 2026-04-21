package com.transit.service.shared.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    /**
     * Register the STOMP endpoint clients connect to.
     * /ws is already in SecurityConfig PUBLIC_ENDPOINTS so the HTTP
     * upgrade handshake is not blocked by the JWT filter.
     * SockJS fallback is enabled for browser clients that don't support
     * native WebSocket (e.g., older mobile browsers).
     */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")   // tighten to your domain in prod
                .withSockJS();
    }

    /**
     * Configure the message broker:
     *   - enableSimpleBroker: in-memory broker handles /topic/... destinations
     *   - setApplicationDestinationPrefixes: routes /app/... to @MessageMapping methods
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic");
        registry.setApplicationDestinationPrefixes("/app");
    }
}
