package com.transit.service.domain.user.dto;

import com.transit.service.domain.user.UserRole;

import java.time.Instant;
import java.util.UUID;

public record UserResponse (
        UUID userId,
        String fullName,
        String email,
        String phone,
        UserRole role,
        boolean active,
        Instant createdAt,
        String token
) {}
