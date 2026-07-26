package com.heartlink.controller;

import com.heartlink.dto.ProfileUpdateRequest;
import com.heartlink.dto.SearchFilters;
import com.heartlink.dto.UserDto;
import com.heartlink.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping("/me")
    public UserDto me(@AuthenticationPrincipal String userId) {
        return profileService.getProfile(userId);
    }

    @PutMapping("/me")
    public UserDto updateMe(@AuthenticationPrincipal String userId, @RequestBody ProfileUpdateRequest req) {
        return profileService.updateProfile(userId, req);
    }

    @GetMapping("/users/{id}")
    public UserDto getUser(@PathVariable String id) {
        return profileService.getProfile(id);
    }

    @GetMapping("/browse")
    public List<UserDto> browse(@AuthenticationPrincipal String userId,
                                 @RequestParam(defaultValue = "20") int limit,
                                 @RequestParam(required = false) String query,
                                 @RequestParam(required = false) Integer minAge,
                                 @RequestParam(required = false) Integer maxAge,
                                 @RequestParam(required = false) String city,
                                 @RequestParam(required = false) String interest) {
        SearchFilters filters = new SearchFilters(query, minAge, maxAge, city, interest);
        return profileService.getBrowseFeed(userId, limit, filters);
    }
}
