package com.heartlink.repository;

import com.heartlink.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findByMatchIdOrderByCreatedAtAsc(String matchId);
    Optional<Message> findTopByMatchIdOrderByCreatedAtDesc(String matchId);
    long countByRecipientIdAndReadFalse(String recipientId);
    long countByMatchIdAndRecipientIdAndReadFalse(String matchId, String recipientId);
}
