package com.heartlink.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Sends transactional emails. If no SMTP host is configured (SMTP_HOST env
 * var), this falls back to logging the email content/link to the console
 * instead of failing — handy for local development where you don't want to
 * set up a real mail server just to test the password reset flow.
 */
@Slf4j
@Service
public class MailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.host:}")
    private String smtpHost;

    @Value("${spring.mail.username:no-reply@heartlink.app}")
    private String fromAddress;

    @Value("${app.contact-email:no-reply@heartlink.app}")
    private String contactEmail;

    public MailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPasswordResetEmail(String toEmail, String resetLink) {
        if (smtpHost == null || smtpHost.isBlank()) {
            log.warn("SMTP not configured — password reset link for {} (would have been emailed): {}",
                    toEmail, resetLink);
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(toEmail);
        message.setSubject("Reset your HeartLink password");
        message.setText(
                "Hi,\n\n" +
                "We received a request to reset your HeartLink password. Click the link below to choose a new one:\n\n" +
                resetLink + "\n\n" +
                "This link expires in 1 hour. If you didn't request this, you can safely ignore this email.\n\n" +
                "— The HeartLink team"
        );
        mailSender.send(message);
    }

    /** Forwards a contact-form submission to the site's admin/support address. */
    public void sendContactMessage(String fromName, String fromEmail, String content) {
        if (smtpHost == null || smtpHost.isBlank()) {
            log.warn("SMTP not configured — contact message from {} <{}> (would have been emailed to {}): {}",
                    fromName, fromEmail, contactEmail, content);
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(contactEmail);
        message.setReplyTo(fromEmail);
        message.setSubject("New HeartLink contact form message from " + fromName);
        message.setText(fromName + " <" + fromEmail + "> wrote:\n\n" + content);
        mailSender.send(message);
    }
}
