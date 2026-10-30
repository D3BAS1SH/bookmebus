package com.transit.service.domain.user.dto;

import com.transit.service.domain.user.UserRole;

import java.util.UUID;

public record UserInfo(
        UUID driverId,
        String fullName,
        String email,
        String phone,
        UserRole role
) {}
