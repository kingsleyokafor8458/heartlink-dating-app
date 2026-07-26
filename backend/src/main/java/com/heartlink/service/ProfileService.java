package com.heartlink.service;

import com.heartlink.dto.ProfileUpdateRequest;
import com.heartlink.dto.SearchFilters;
import com.heartlink.dto.UserDto;
import com.heartlink.exception.ApiException;
import com.heartlink.model.Swipe;
import com.heartlink.model.User;
import com.heartlink.repository.SwipeRepository;
import com.heartlink.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;
    private final SwipeRepository swipeRepository;
    private final SafetyService safetyService;

    public UserDto getProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));
        return UserDto.from(user);
    }

    public UserDto updateProfile(String userId, ProfileUpdateRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));

        if (req.name() != null) user.setName(req.name());
        if (req.age() != null) user.setAge(req.age());
        if (req.bio() != null) user.setBio(req.bio());
        if (req.city() != null) user.setCity(req.city());
        if (req.country() != null) user.setCountry(req.country());
        if (req.photoUrls() != null) user.setPhotoUrls(req.photoUrls());
        if (req.interests() != null) user.setInterests(req.interests());

        user = userRepository.save(user);
        return UserDto.from(user);
    }

    /** Returns candidate profiles the user hasn't already swiped on, excluding blocked users. */
    public List<UserDto> getBrowseFeed(String userId, int limit, SearchFilters filters) {
        List<String> alreadySwiped = swipeRepository.findBySwiperId(userId).stream()
                .map(Swipe::getTargetId)
                .collect(Collectors.toList());
        alreadySwiped.add(userId);
        alreadySwiped.addAll(safetyService.getBlockedUserIds(userId));

        return userRepository.findByIdNotIn(alreadySwiped).stream()
                .filter(User::isActive)
                .filter(candidate -> !safetyService.isBlockedEitherWay(userId, candidate.getId()))
                .filter(candidate -> matchesFilters(candidate, filters))
                .limit(limit)
                .map(UserDto::from)
                .collect(Collectors.toList());
    }

    private boolean matchesFilters(User candidate, SearchFilters filters) {
        if (filters == null || filters.isEmpty()) return true;

        if (filters.query() != null && !filters.query().isBlank()) {
            String q = filters.query().toLowerCase().trim();
            if (candidate.getName() == null || !candidate.getName().toLowerCase().contains(q)) return false;
        }
        if (filters.minAge() != null && (candidate.getAge() == null || candidate.getAge() < filters.minAge())) return false;
        if (filters.maxAge() != null && (candidate.getAge() == null || candidate.getAge() > filters.maxAge())) return false;
        if (filters.city() != null && !filters.city().isBlank()) {
            if (candidate.getCity() == null || !candidate.getCity().equalsIgnoreCase(filters.city().trim())) return false;
        }
        if (filters.interest() != null && !filters.interest().isBlank()) {
            if (candidate.getInterests() == null ||
                    candidate.getInterests().stream().noneMatch(i -> i.equalsIgnoreCase(filters.interest().trim()))) {
                return false;
            }
        }
        return true;
    }
}
