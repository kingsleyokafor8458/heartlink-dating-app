package com.heartlink.service;

import com.heartlink.dto.ConversationDto;
import com.heartlink.dto.MessageRequest;
import com.heartlink.dto.UserDto;
import com.heartlink.exception.ApiException;
import com.heartlink.model.Match;
import com.heartlink.model.Message;
import com.heartlink.repository.MatchRepository;
import com.heartlink.repository.MessageRepository;
import com.heartlink.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final MatchRepository matchRepository;
    private final UserRepository userRepository;
    private final SafetyService safetyService;

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

        if (safetyService.isBlockedEitherWay(senderId, recipientId)) {
            throw new ApiException("Unable to message this user", HttpStatus.FORBIDDEN);
        }

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

        List<Message> messages = messageRepository.findByMatchIdOrderByCreatedAtAsc(matchId);

        // Mark incoming messages as read now that the user has opened the conversation.
        messages.stream()
                .filter(m -> m.getRecipientId().equals(userId) && !m.isRead())
                .forEach(m -> {
                    m.setRead(true);
                    messageRepository.save(m);
                });

        return messages;
    }

    /** One row per match, with the other person's profile and a preview of the last message, newest first. */
    public List<ConversationDto> getConversations(String userId) {
        List<Match> matches = matchRepository.findByUserIdsContaining(userId);

        return matches.stream()
                .map(match -> {
                    String otherUserId = match.getUserIds().stream()
                            .filter(id -> !id.equals(userId))
                            .findFirst()
                            .orElse(null);
                    if (otherUserId == null) return null;

                    Optional<com.heartlink.model.User> otherUser = userRepository.findById(otherUserId);
                    if (otherUser.isEmpty()) return null;

                    Optional<Message> lastMessage = messageRepository.findTopByMatchIdOrderByCreatedAtDesc(match.getId());
                    boolean hasUnread = messageRepository.countByMatchIdAndRecipientIdAndReadFalse(match.getId(), userId) > 0;

                    return new ConversationDto(
                            match.getId(),
                            UserDto.from(otherUser.get()),
                            lastMessage.map(Message::getContent).orElse(null),
                            lastMessage.map(Message::getCreatedAt).orElse(match.getCreatedAt()),
                            lastMessage.map(m -> m.getSenderId().equals(userId)).orElse(false),
                            hasUnread
                    );
                })
                .filter(c -> c != null)
                .sorted(Comparator.comparing(ConversationDto::lastMessageAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .collect(Collectors.toList());
    }

    public long getUnreadCount(String userId) {
        return messageRepository.countByRecipientIdAndReadFalse(userId);
    }
}
