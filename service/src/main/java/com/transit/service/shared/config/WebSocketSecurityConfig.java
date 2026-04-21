package com.transit.service.shared.config;

import com.transit.service.shared.security.JwtService;
import com.transit.service.shared.security.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * Secures the STOMP inbound channel.
 *
 * Why a ChannelInterceptor and not Spring Security's HTTP filter?
 *   The HTTP WebSocket upgrade handshake passes through SecurityConfig (the
 *   /ws/** endpoint is whitelisted). After the upgrade, messages travel over
 *   the WebSocket connection as STOMP frames — they never go through the HTTP
 *   filter chain. This interceptor fills that gap.
 *
 * What it does:
 *   - STOMP CONNECT  → extract JWT from "Authorization" native header,
 *                       validate it, set the Principal on the session.
 *                       Rejects the frame if the token is missing or invalid.
 *   - STOMP SUBSCRIBE / SEND / other → passed through unchanged.
 *     (Topic-level access control is enforced by LocationController on the
 *      driver side — the REST endpoint validates the JWT via the HTTP filter.)
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
public class WebSocketSecurityConfig implements WebSocketMessageBrokerConfigurer {
    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX        = "Bearer ";

    private final JwtService jwtService;
    private final UserDetailsServiceImpl userDetailsService;

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {

            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {

                StompHeaderAccessor accessor =
                        MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

                if (accessor == null) {
                    return message;
                }

                // Only enforce auth on the CONNECT command.
                if (!StompCommand.CONNECT.equals(accessor.getCommand())) {
                    return message;
                }

                String authHeader = accessor.getFirstNativeHeader(AUTHORIZATION_HEADER);

                if (authHeader == null || !authHeader.startsWith(BEARER_PREFIX)) {
                    log.warn("WebSocket CONNECT rejected — missing or malformed Authorization header");
                    throw new IllegalArgumentException("Missing Authorization header on STOMP CONNECT");
                }

                String jwt = authHeader.substring(BEARER_PREFIX.length());

                try {
                    String email = jwtService.extractUsername(jwt);

                    if (email == null) {
                        throw new IllegalArgumentException("JWT subject is null");
                    }

                    UserDetails userDetails = userDetailsService.loadUserByUsername(email);

                    if (!jwtService.isTokenValid(jwt, userDetails)) {
                        throw new IllegalArgumentException("JWT token is invalid or expired");
                    }

                    // Attach the authenticated principal to the STOMP session.
                    // Spring's in-memory broker uses this for session tracking.
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    accessor.setUser(authToken);

                    log.debug("WebSocket CONNECT authenticated for user: {}", email);

                } catch (Exception ex) {
                    log.warn("WebSocket CONNECT rejected — JWT validation failed: {}", ex.getMessage());
                    throw new IllegalArgumentException("Invalid JWT: " + ex.getMessage());
                }

                return message;
            }
        });
    }
}
