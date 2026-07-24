package com.heartlink.controller;

import com.heartlink.dto.MessageRequest;
import com.heartlink.model.Message;
import com.heartlink.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    public Message send(@AuthenticationPrincipal String userId, @RequestBody MessageRequest req) {
        return messageService.sendMessage(userId, req);
    }

    @GetMapping("/{matchId}")
    public List<Message> conversation(@AuthenticationPrincipal String userId, @PathVariable String matchId) {
        return messageService.getConversation(userId, matchId);
    }
}
