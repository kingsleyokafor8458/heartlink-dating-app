package com.heartlink.controller;

import com.heartlink.dto.SafetyDtos.ReportRequest;
import com.heartlink.model.Report;
import com.heartlink.service.SafetyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SafetyController {

    private final SafetyService safetyService;

    @PostMapping("/reports")
    public Report report(@AuthenticationPrincipal String userId, @Valid @RequestBody ReportRequest req) {
        return safetyService.reportUser(userId, req);
    }

    @PostMapping("/blocks/{userId}")
    public Map<String, Boolean> block(@AuthenticationPrincipal String blockerId, @PathVariable String userId) {
        safetyService.blockUser(blockerId, userId);
        return Map.of("blocked", true);
    }

    @DeleteMapping("/blocks/{userId}")
    public Map<String, Boolean> unblock(@AuthenticationPrincipal String blockerId, @PathVariable String userId) {
        safetyService.unblockUser(blockerId, userId);
        return Map.of("blocked", false);
    }

    @GetMapping("/blocks")
    public List<String> blockedUsers(@AuthenticationPrincipal String userId) {
        return safetyService.getBlockedUserIds(userId);
    }
}
