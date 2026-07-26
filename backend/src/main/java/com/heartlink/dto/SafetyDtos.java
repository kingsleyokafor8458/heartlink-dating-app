package com.heartlink.dto;

import jakarta.validation.constraints.NotBlank;

public class SafetyDtos {

    public record ReportRequest(
            @NotBlank String reportedUserId,
            @NotBlank String reason,
            String details
    ) {}
}
