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

    public record SwipeResult(boolean isMatch, Match match) {}

    public SwipeResult swipe(String swiperId, SwipeRequest req) {
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
}
