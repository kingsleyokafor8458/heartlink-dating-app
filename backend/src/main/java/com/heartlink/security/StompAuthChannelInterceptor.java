package com.heartlink.security;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;

import java.security.Principal;
import java.util.Collections;

/**
 * Runs on the STOMP CONNECT frame. The client sends its JWT as a native
 * STOMP header (see frontend chat.js: `Authorization: Bearer <token>`),
 * which we validate the same way the HTTP JwtAuthFilter does, then attach
 * the userId as the session Principal so @MessageMapping handlers know who
 * sent each message.
 */
@Component
@RequiredArgsConstructor
public class StompAuthChannelInterceptor implements ChannelInterceptor {

    private final JwtService jwtService;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            String authHeader = accessor.getFirstNativeHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                if (jwtService.isValid(token)) {
                    String userId = jwtService.extractUserId(token);
                    Principal principal = new UsernamePasswordAuthenticationToken(userId, null, Collections.emptyList());
                    accessor.setUser(principal);
                }
            }
        }
        return message;
    }
}
