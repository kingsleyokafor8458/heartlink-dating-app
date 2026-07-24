package com.heartlink.controller;

import com.heartlink.dto.SwipeRequest;
import com.heartlink.dto.UserDto;
import com.heartlink.model.Match;
import com.heartlink.service.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;

    @PostMapping("/swipe")
    public Map<String, Object> swipe(@AuthenticationPrincipal String userId, @RequestBody SwipeRequest req) {
        MatchService.SwipeResult result = matchService.swipe(userId, req);
        return Map.of("isMatch", result.isMatch(), "match", result.match() != null ? result.match() : Map.of());
    }

    @GetMapping("/matches")
    public List<Match> matches(@AuthenticationPrincipal String userId) {
        return matchService.getMatches(userId);
    }

    @GetMapping("/matches/profiles")
    public List<UserDto> matchProfiles(@AuthenticationPrincipal String userId) {
        return matchService.getMatchProfiles(userId);
    }
}
