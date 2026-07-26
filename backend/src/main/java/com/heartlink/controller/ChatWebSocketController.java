package com.heartlink.controller;

import com.heartlink.dto.MessageRequest;
import com.heartlink.model.Message;
import com.heartlink.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Client sends to /app/chat.send with a MessageRequest body. We persist
     * it exactly like the REST endpoint does (same validation, same blocked-
     * user check), then broadcast the saved message to everyone subscribed
     * to /topic/matches/{matchId} — i.e. both people in that match.
     */
    @MessageMapping("/chat.send")
    public void send(MessageRequest req, Principal principal) {
        if (principal == null) {
            return; // unauthenticated frame; StompAuthChannelInterceptor didn't attach a user
        }
        String senderId = principal.getName();
        Message saved = messageService.sendMessage(senderId, req);
        messagingTemplate.convertAndSend("/topic/matches/" + req.matchId(), saved);
    }
}
