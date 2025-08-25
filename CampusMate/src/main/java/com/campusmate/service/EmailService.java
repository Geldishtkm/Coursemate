package com.campusmate.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;

/**
 * Service for sending emails
 */
@Service
public class EmailService {

    @PostConstruct
    public void checkConfiguration() {
        if (fromEmail == null || fromEmail.trim().isEmpty() || fromEmail.equals("your-email@gmail.com")) {
            log.error("⚠️  EMAIL SERVICE NOT CONFIGURED!");
            log.error("Set MAIL_USERNAME and MAIL_PASSWORD environment variables");
            log.error("Registration will fail until email is configured");
        } else {
            log.info("✅ Email service configured with: {}", fromEmail);
        }
    }

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    /**
     * Send email verification email
     */
    public void sendVerificationEmail(String toEmail, String token, String firstName) {
        // Check if email configuration is available
        if (fromEmail == null || fromEmail.trim().isEmpty()) {
            log.error("Email configuration missing: MAIL_USERNAME not set");
            throw new RuntimeException("Email service not configured. Please set MAIL_USERNAME and MAIL_PASSWORD environment variables.");
        }
        
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Verify Your Email - CampusMate");
            
            String verificationUrl = frontendUrl + "/verify-email?token=" + token;
            
            String emailBody = String.format(
                "Hello %s,\n\n" +
                "Thank you for registering with CampusMate! Please verify your email address by clicking the link below:\n\n" +
                "%s\n\n" +
                "This link will expire in 24 hours.\n\n" +
                "If you didn't create an account, please ignore this email.\n\n" +
                "Best regards,\n" +
                "The CampusMate Team",
                firstName, verificationUrl
            );
            
            message.setText(emailBody);
            
            mailSender.send(message);
            log.info("Verification email sent successfully to: {}", toEmail);
            
        } catch (Exception e) {
            log.error("Failed to send verification email to: {}", toEmail, e);
            throw new RuntimeException("Failed to send verification email: " + e.getMessage());
        }
    }

    /**
     * Send password reset email
     */
    public void sendPasswordResetEmail(String toEmail, String token, String firstName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Reset Your Password - CampusMate");
            
            String resetUrl = frontendUrl + "/reset-password?token=" + token;
            
            String emailBody = String.format(
                "Hello %s,\n\n" +
                "You requested a password reset for your CampusMate account. Click the link below to reset your password:\n\n" +
                "%s\n\n" +
                "This link will expire in 1 hour.\n\n" +
                "If you didn't request a password reset, please ignore this email.\n\n" +
                "Best regards,\n" +
                "The CampusMate Team",
                firstName, resetUrl
            );
            
            message.setText(emailBody);
            
            mailSender.send(message);
            log.info("Password reset email sent successfully to: {}", toEmail);
            
        } catch (Exception e) {
            log.error("Failed to send password reset email to: {}", toEmail, e);
            throw new RuntimeException("Failed to send password reset email", e);
        }
    }
}
