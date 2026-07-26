package com.heartlink.dto;

import java.time.Instant;

public record ConversationDto(
        String matchId,
        UserDto otherUser,
        String lastMessageContent,
        Instant lastMessageAt,
        boolean lastMessageMine,
        boolean hasUnread
) {}
