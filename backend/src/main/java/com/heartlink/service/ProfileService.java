package com.heartlink.service;

import com.heartlink.dto.ProfileUpdateRequest;
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
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;
    private final SwipeRepository swipeRepository;

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

    /** Returns candidate profiles the user hasn't already swiped on. */
    public List<UserDto> getBrowseFeed(String userId, int limit) {
        List<String> alreadySwiped = swipeRepository.findBySwiperId(userId).stream()
                .map(Swipe::getTargetId)
                .collect(Collectors.toList());
        alreadySwiped.add(userId);

        return userRepository.findByIdNotIn(alreadySwiped).stream()
                .filter(User::isActive)
                .limit(limit)
                .map(UserDto::from)
                .collect(Collectors.toList());
    }
}
