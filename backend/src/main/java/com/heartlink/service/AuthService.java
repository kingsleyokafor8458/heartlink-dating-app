package com.heartlink.service;

import com.heartlink.dto.AuthDtos.AuthResponse;
import com.heartlink.dto.AuthDtos.LoginRequest;
import com.heartlink.dto.AuthDtos.SignupRequest;
import com.heartlink.dto.UserDto;
import com.heartlink.exception.ApiException;
import com.heartlink.model.User;
import com.heartlink.repository.UserRepository;
import com.heartlink.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse signup(SignupRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            throw new ApiException("An account with this email already exists", HttpStatus.CONFLICT);
        }

        User user = User.builder()
                .email(req.email().toLowerCase().trim())
                .passwordHash(passwordEncoder.encode(req.password()))
                .name(req.name())
                .age(req.age())
                .gender(req.gender())
                .interestedIn(req.interestedIn() != null ? req.interestedIn() : List.of())
                .photoUrls(List.of())
                .interests(List.of())
                .verified(false)
                .active(true)
                .roles(List.of("USER"))
                .createdAt(Instant.now())
                .lastActiveAt(Instant.now())
                .build();

        user = userRepository.save(user);
        String token = jwtService.generateToken(user.getId(), user.getEmail());
        return new AuthResponse(token, UserDto.from(user));
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.email().toLowerCase().trim())
                .orElseThrow(() -> new ApiException("Invalid email or password", HttpStatus.UNAUTHORIZED));

        if (!passwordEncoder.matches(req.password(), user.getPasswordHash())) {
            throw new ApiException("Invalid email or password", HttpStatus.UNAUTHORIZED);
        }

        user.setLastActiveAt(Instant.now());
        user.setOnline(true);
        userRepository.save(user);

        String token = jwtService.generateToken(user.getId(), user.getEmail());
        return new AuthResponse(token, UserDto.from(user));
    }
}
