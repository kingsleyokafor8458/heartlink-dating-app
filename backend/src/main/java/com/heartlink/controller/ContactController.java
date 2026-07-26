package com.heartlink.controller;

import com.heartlink.dto.ContactRequest;
import com.heartlink.service.MailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private final MailService mailService;

    @PostMapping
    public Map<String, String> submit(@Valid @RequestBody ContactRequest req) {
        mailService.sendContactMessage(req.name(), req.email(), req.message());
        return Map.of("message", "Thanks for reaching out — we'll get back to you soon.");
    }
}
