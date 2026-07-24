package com.heartlink.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AuthDtos {

    public record SignupRequest(
            @NotBlank @Email String email,
            @NotBlank @Size(min = 8) String password,
            @NotBlank String name,
            Integer age,
            String gender,
            java.util.List<String> interestedIn
    ) {}

    public record LoginRequest(
            @NotBlank @Email String email,
            @NotBlank String password
    ) {}

    public record AuthResponse(
            String token,
            UserDto user
    ) {}
}
