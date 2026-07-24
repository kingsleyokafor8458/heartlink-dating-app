package com.heartlink.service;

import com.heartlink.dto.MessageRequest;
import com.heartlink.exception.ApiException;
import com.heartlink.model.Match;
import com.heartlink.model.Message;
import com.heartlink.repository.MatchRepository;
import com.heartlink.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final MatchRepository matchRepository;

    public Message sendMessage(String senderId, MessageRequest req) {
        Match match = matchRepository.findById(req.matchId())
                .orElseThrow(() -> new ApiException("Match not found", HttpStatus.NOT_FOUND));

        if (!match.getUserIds().contains(senderId)) {
            throw new ApiException("Not authorized for this match", HttpStatus.FORBIDDEN);
        }

        String recipientId = match.getUserIds().stream()
                .filter(id -> !id.equals(senderId))
                .findFirst()
                .orElseThrow(() -> new ApiException("Recipient not found", HttpStatus.NOT_FOUND));

        Message message = Message.builder()
                .matchId(req.matchId())
                .senderId(senderId)
                .recipientId(recipientId)
                .content(req.content())
                .read(false)
                .createdAt(Instant.now())
                .build();

        message = messageRepository.save(message);

        match.setLastMessageAt(Instant.now());
        matchRepository.save(match);

        return message;
    }

    public List<Message> getConversation(String userId, String matchId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ApiException("Match not found", HttpStatus.NOT_FOUND));

        if (!match.getUserIds().contains(userId)) {
            throw new ApiException("Not authorized for this match", HttpStatus.FORBIDDEN);
        }

        return messageRepository.findByMatchIdOrderByCreatedAtAsc(matchId);
    }
}
