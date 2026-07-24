package com.heartlink.repository;

import com.heartlink.model.Swipe;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface SwipeRepository extends MongoRepository<Swipe, String> {
    Optional<Swipe> findBySwiperIdAndTargetId(String swiperId, String targetId);
    List<Swipe> findBySwiperId(String swiperId);
    List<Swipe> findByTargetIdAndSwiperIdAndAction(String targetId, String swiperId, String action);
}
