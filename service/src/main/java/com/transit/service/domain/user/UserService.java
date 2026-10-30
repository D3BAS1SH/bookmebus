package com.transit.service.domain.user;

import com.transit.service.domain.user.dto.LoginRequest;
import com.transit.service.domain.user.dto.RegisterRequest;
import com.transit.service.domain.user.dto.UserInfo;
import com.transit.service.domain.user.dto.UserResponse;

import java.util.List;

public interface UserService {
    /**
     * Authenticates a user by email + plain-text password and returns a JWT.
     *
     * @throws org.springframework.security.core.AuthenticationException
     *         if credentials are invalid
     */
    UserResponse login(LoginRequest loginRequest);

    /**
     * Registers a new user, hashes their password, and returns the created
     * user along with a signed JWT ready for immediate use.
     *
     * @throws com.transit.service.shared.exception.BookingConflictException
     *         if the email is already taken
     */
    UserResponse register(RegisterRequest registerRequest);

    List<UserInfo> getAllDrivers();
}
