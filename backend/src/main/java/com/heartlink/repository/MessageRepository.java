package com.heartlink.repository;

import com.heartlink.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findByMatchIdOrderByCreatedAtAsc(String matchId);
}
