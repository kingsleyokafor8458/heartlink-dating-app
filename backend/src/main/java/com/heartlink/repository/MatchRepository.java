package com.heartlink.repository;

import com.heartlink.model.Match;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MatchRepository extends MongoRepository<Match, String> {
    List<Match> findByUserIdsContaining(String userId);
}
