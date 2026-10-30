package com.transit.service.domain.user;

import com.transit.service.domain.user.dto.LoginRequest;
import com.transit.service.domain.user.dto.RegisterRequest;
import com.transit.service.domain.user.dto.UserInfo;
import com.transit.service.domain.user.dto.UserResponse;
import com.transit.service.shared.exception.BookingConflictException;
import com.transit.service.shared.security.JwtService;
import jakarta.validation.constraints.NotNull;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    // Register User
    @Override
    @Transactional
    public UserResponse register(RegisterRequest registerRequest) {
        if(userRepository.existsByEmail(registerRequest.email())){
            throw new BookingConflictException("Email Already Exists: "+registerRequest.email());
        }

        User user = User.builder()
                .fullName(registerRequest.fullName())
                .email(registerRequest.email())
                .phone(registerRequest.phone())
                .passwordHash(passwordEncoder.encode(registerRequest.password()))
                .role(registerRequest.role())
                .isActive(true)
                .build();

        User savedUser = userRepository.save(user);

        log.info("User with email {} registered successfully", registerRequest.email());
        return this.toResponseBuilder(savedUser, null);
    }

    // Login
    @Override
    @Transactional
    public UserResponse login(LoginRequest loginRequest) {
        if(!userRepository.existsByEmail(loginRequest.email())){
            throw new BookingConflictException("Email does not exist: "+loginRequest.email());
        }

        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginRequest.email(),
                loginRequest.password()
        ));

        User user = userRepository.findByEmail(loginRequest.email()).orElseThrow(()-> new IllegalStateException("User with email "+loginRequest.email()+" not found"));

        String token = jwtService.generateToken(user);
        log.info("User with email {} logged in successfully", loginRequest.email());
        return this.toResponseBuilder(user, token);
    }

    // Get all drivers
    @Override
    @Transactional(readOnly = true)
    public List<UserInfo> getAllDrivers() {
        List<User> allDrivers = this.userRepository.findAllByRole(UserRole.DRIVER);

        return allDrivers.stream().map(this::toUserInfo).toList();
    }

    // Mapper Helper
    private UserResponse toResponseBuilder(@NonNull User user, String token){
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.isActive(),
                user.getCreatedAt(),
                token
        );
    }

    private UserInfo toUserInfo(@NotNull User user){
        return new UserInfo(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole()
        );
    }


}
