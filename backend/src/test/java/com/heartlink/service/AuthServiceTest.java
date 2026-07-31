package com.heartlink.service;

import com.heartlink.dto.AuthDtos.AuthResponse;
import com.heartlink.dto.AuthDtos.LoginRequest;
import com.heartlink.model.User;
import com.heartlink.repository.UserRepository;
import com.heartlink.security.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    @Test
    void login_shouldReturnAuthResponse_whenCredentialsAreValid() {

        // Arrange
        User user = User.builder()
                .id("user-123")
                .email("test@example.com")
                .passwordHash("hashed-password")
                .name("Test User")
                .build();

        LoginRequest request = new LoginRequest(
                "test@example.com",
                "password123"
        );

        when(userRepository.findByEmail("test@example.com"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches("password123", "hashed-password"))
                .thenReturn(true);

        when(jwtService.generateToken("user-123", "test@example.com"))
                .thenReturn("mock-jwt-token");

        // Act
        AuthResponse response = authService.login(request);

        // Assert
        assertNotNull(response);
        assertEquals("mock-jwt-token", response.token());
        assertNotNull(response.user());

        verify(userRepository).findByEmail("test@example.com");
        verify(passwordEncoder).matches("password123", "hashed-password");
        verify(jwtService).generateToken("user-123", "test@example.com");
    }
}
