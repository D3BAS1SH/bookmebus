package com.transit.service.domain.user.dto;

import com.transit.service.domain.user.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest (
        @NotBlank(message = "Name is required")
        @Size(max = 100, message = "Name Must not exceed 100 characters")
        String fullName,

        @NotBlank(message = "Email is required")
        @Size(max = 150, message = "Email must not exceed 150 characters")
        @Email(message = "Must be a valid email")
        String email,

        @NotBlank(message = "Phone number is required")
        @Size(max = 15, min = 7, message = "Phone number must not exceed 15 characters")
        String phone,

        @NotBlank(message = "Password is required")
        @Size(min = 8, max = 30, message = "Password length must be between 8 and 30")
        String password,

        @NotBlank(message = "Role is required")
        UserRole role
){}
