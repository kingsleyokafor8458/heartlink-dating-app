package com.heartlink.dto;

import jakarta.validation.constraints.NotBlank;

public record MessageRequest(
        @NotBlank String matchId,
        @NotBlank String content
) {}
