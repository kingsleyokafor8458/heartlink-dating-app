package com.heartlink.repository;

import com.heartlink.model.Block;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface BlockRepository extends MongoRepository<Block, String> {
    List<Block> findByBlockerId(String blockerId);
    Optional<Block> findByBlockerIdAndBlockedUserId(String blockerId, String blockedUserId);
    boolean existsByBlockerIdAndBlockedUserId(String blockerId, String blockedUserId);
}
