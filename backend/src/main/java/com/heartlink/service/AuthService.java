package com.heartlink.service;

import com.heartlink.dto.AuthDtos.AuthResponse;
import com.heartlink.dto.AuthDtos.ForgotPasswordRequest;
import com.heartlink.dto.AuthDtos.LoginRequest;
import com.heartlink.dto.AuthDtos.ResetPasswordRequest;
import com.heartlink.dto.AuthDtos.SignupRequest;
import com.heartlink.dto.UserDto;
import com.heartlink.exception.ApiException;
import com.heartlink.model.User;
import com.heartlink.repository.UserRepository;
import com.heartlink.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final MailService mailService;

    @Value("${app.frontend-url}")
    private String frontendUrl;

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

    /**
     * Always returns successfully whether or not the email exists, so callers
     * can't use this endpoint to probe which emails are registered.
     */
    public void forgotPassword(ForgotPasswordRequest req) {
        userRepository.findByEmail(req.email().toLowerCase().trim()).ifPresent(user -> {
            String token = UUID.randomUUID().toString();
            user.setResetToken(token);
            user.setResetTokenExpiresAt(Instant.now().plus(1, ChronoUnit.HOURS));
            userRepository.save(user);

            String resetLink = frontendUrl + "/reset-password?token=" + token;
            mailService.sendPasswordResetEmail(user.getEmail(), resetLink);
        });
    }

    public void resetPassword(ResetPasswordRequest req) {
        User user = userRepository.findByResetToken(req.token())
                .orElseThrow(() -> new ApiException("Invalid or expired reset link", HttpStatus.BAD_REQUEST));

        if (user.getResetTokenExpiresAt() == null || user.getResetTokenExpiresAt().isBefore(Instant.now())) {
            throw new ApiException("Invalid or expired reset link", HttpStatus.BAD_REQUEST);
        }

        user.setPasswordHash(passwordEncoder.encode(req.newPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiresAt(null);
        userRepository.save(user);
    }
}
