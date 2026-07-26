package com.heartlink.service;

import com.heartlink.dto.SwipeRequest;
import com.heartlink.dto.UserDto;
import com.heartlink.model.Match;
import com.heartlink.model.Swipe;
import com.heartlink.model.User;
import com.heartlink.repository.MatchRepository;
import com.heartlink.repository.SwipeRepository;
import com.heartlink.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchService {

    private final SwipeRepository swipeRepository;
    private final MatchRepository matchRepository;
    private final UserRepository userRepository;
    private final SafetyService safetyService;

    public record SwipeResult(boolean isMatch, Match match) {}

    public SwipeResult swipe(String swiperId, SwipeRequest req) {
        if (safetyService.isBlockedEitherWay(swiperId, req.targetId())) {
            throw new com.heartlink.exception.ApiException(
                    "Unable to interact with this user", org.springframework.http.HttpStatus.FORBIDDEN);
        }
        swipeRepository.findBySwiperIdAndTargetId(swiperId, req.targetId())
                .ifPresentOrElse(
                        existing -> {
                            existing.setAction(req.action());
                            swipeRepository.save(existing);
                        },
                        () -> swipeRepository.save(Swipe.builder()
                                .swiperId(swiperId)
                                .targetId(req.targetId())
                                .action(req.action())
                                .createdAt(Instant.now())
                                .build())
                );

        boolean isLike = "LIKE".equals(req.action()) || "SUPER_LIKE".equals(req.action());
        if (!isLike) {
            return new SwipeResult(false, null);
        }

        boolean mutualLike = !swipeRepository
                .findByTargetIdAndSwiperIdAndAction(swiperId, req.targetId(), "LIKE").isEmpty()
                || !swipeRepository
                .findByTargetIdAndSwiperIdAndAction(swiperId, req.targetId(), "SUPER_LIKE").isEmpty();

        if (mutualLike) {
            List<String> ids = List.of(swiperId, req.targetId()).stream().sorted().collect(Collectors.toList());
            Match match = Match.builder()
                    .userIds(ids)
                    .createdAt(Instant.now())
                    .build();
            match = matchRepository.save(match);
            return new SwipeResult(true, match);
        }

        return new SwipeResult(false, null);
    }

    public List<Match> getMatches(String userId) {
        return matchRepository.findByUserIdsContaining(userId);
    }

    public List<UserDto> getMatchProfiles(String userId) {
        return getMatches(userId).stream()
                .map(m -> m.getUserIds().stream().filter(id -> !id.equals(userId)).findFirst())
                .filter(Optional::isPresent)
                .map(Optional::get)
                .map(userRepository::findById)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .map(UserDto::from)
                .collect(Collectors.toList());
    }

    /**
     * Everyone who has liked/super-liked this user, excluding people already
     * matched with (they show up in Matches instead) and blocked users.
     */
    public List<UserDto> getUsersWhoLikedMe(String userId) {
        List<String> alreadyMatchedIds = getMatches(userId).stream()
                .flatMap(m -> m.getUserIds().stream())
                .filter(id -> !id.equals(userId))
                .collect(Collectors.toList());

        java.util.LinkedHashSet<String> likerIds = new java.util.LinkedHashSet<>();
        swipeRepository.findByTargetIdAndAction(userId, "LIKE").forEach(s -> likerIds.add(s.getSwiperId()));
        swipeRepository.findByTargetIdAndAction(userId, "SUPER_LIKE").forEach(s -> likerIds.add(s.getSwiperId()));

        return likerIds.stream()
                .filter(id -> !alreadyMatchedIds.contains(id))
                .filter(id -> !safetyService.isBlockedEitherWay(userId, id))
                .map(userRepository::findById)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .filter(User::isActive)
                .map(UserDto::from)
                .collect(Collectors.toList());
    }

    /**
     * Removes the user's most recent swipe so the profile reappears in their
     * browse feed. Only undoes the swipe record itself — if it had already
     * created a match (i.e. it was a mutual like), the match and any
     * messages are left alone rather than silently deleting a conversation.
     */
    public Optional<UserDto> undoLastSwipe(String userId) {
        return swipeRepository.findTopBySwiperIdOrderByCreatedAtDesc(userId)
                .flatMap(lastSwipe -> {
                    String targetId = lastSwipe.getTargetId();
                    swipeRepository.delete(lastSwipe);
                    return userRepository.findById(targetId).map(UserDto::from);
                });
    }
}
