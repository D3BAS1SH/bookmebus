package com.transit.service.shared.security;

import com.transit.service.shared.config.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
@Slf4j
public class JwtService {
    private final JwtProperties jwtProperties;

    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(),userDetails);
    }

    // Generate new token

    public String generateToken(Map<String, Object> extraClaims, UserDetails useDetails){
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .claims(extraClaims)
                .subject(useDetails.getUsername())
                .issuer(jwtProperties.getIssuer())
                .issuedAt(new Date(now))
                .expiration(new Date(now + jwtProperties.getAccessTokenExpiry().toMillis()))
                .signWith(signingKey(),Jwts.SIG.HS256)
                .compact();
    }

    // Token Validation

    public boolean isTokenValid(String token, UserDetails userDetails) {
        try {
            final String name = extractUsername(token);
            return name.equals(userDetails.getUsername()) && !isTokenExpired(token);
        } catch (JwtException ex) {
            log.warn(ex.getMessage());
            return false;
        }
    }

    // Extract Claims

    public String extractUsername(String token){
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token){
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver){
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Internal methods

    private boolean isTokenExpired(String token){
        return extractExpiration(token).before(new Date());
    }

    private Claims extractAllClaims(String token){
        return Jwts.parser()
                .verifyWith(signingKey())
                .build()
                .parseSignedClaims(token).getPayload();
    }

    private SecretKey signingKey() {
        byte[] keybytes = Decoders.BASE64.decode(jwtProperties.getSecretKey());
        return Keys.hmacShaKeyFor(keybytes);
    }
}
