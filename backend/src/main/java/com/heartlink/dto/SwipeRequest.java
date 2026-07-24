package com.heartlink.dto;

import jakarta.validation.constraints.NotBlank;

public record SwipeRequest(
        @NotBlank String targetId,
        @NotBlank String action // LIKE, PASS, SUPER_LIKE
) {}
