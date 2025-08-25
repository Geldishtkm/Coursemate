package com.campusmate.service;

import com.campusmate.entity.EmailVerificationToken;
import com.campusmate.entity.User;
import com.campusmate.repository.EmailVerificationTokenRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

/**
 * Service for handling email verification
 */
@Service
public class EmailVerificationService {

    private static final Logger log = LoggerFactory.getLogger(EmailVerificationService.class);

    @Autowired
    private EmailVerificationTokenRepository tokenRepository;

    @Autowired
    private EmailService emailService;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    /**
     * Check if email service is properly configured
     */
    public boolean isEmailServiceConfigured() {
        return mailUsername != null && !mailUsername.trim().isEmpty();
    }

    /**
     * Generate and save verification token for a user
     */
    @Transactional
    public String generateVerificationToken(User user) {
        // Delete any existing tokens for this user
        tokenRepository.deleteByUserId(user.getId());

        // Generate new token
        String token = UUID.randomUUID().toString();
        LocalDateTime expiry = LocalDateTime.now().plusHours(24); // 24 hours expiry

        EmailVerificationToken verificationToken = new EmailVerificationToken(token, user, expiry);
        tokenRepository.save(verificationToken);

        log.info("Generated verification token for user: {}", user.getEmail());
        return token;
    }

    /**
     * Verify email token and activate user
     */
    @Transactional
    public boolean verifyEmailToken(String token) {
        Optional<EmailVerificationToken> tokenOpt = tokenRepository.findByToken(token);
        
        if (tokenOpt.isEmpty()) {
            log.warn("Verification token not found: {}", token);
            return false;
        }

        EmailVerificationToken verificationToken = tokenOpt.get();
        
        if (!verificationToken.isValid()) {
            log.warn("Invalid verification token: {} (expired: {}, used: {})", 
                    token, verificationToken.isExpired(), verificationToken.getIsUsed());
            return false;
        }

        // Mark token as used
        verificationToken.setIsUsed(true);
        tokenRepository.save(verificationToken);

        // Activate user
        User user = verificationToken.getUser();
        user.setIsVerified(true);
        
        log.info("Email verified successfully for user: {}", user.getEmail());
        return true;
    }

    /**
     * Resend verification email
     */
    @Transactional
    public void resendVerificationEmail(User user) {
        String token = generateVerificationToken(user);
        emailService.sendVerificationEmail(user.getEmail(), token, user.getFirstName());
        log.info("Verification email resent to user: {}", user.getEmail());
    }

    /**
     * Clean up expired tokens (runs every hour)
     */
    @Scheduled(fixedRate = 3600000) // 1 hour
    @Transactional
    public void cleanupExpiredTokens() {
        try {
            tokenRepository.deleteExpiredTokens(LocalDateTime.now());
            log.info("Cleaned up expired verification tokens");
        } catch (Exception e) {
            log.error("Error cleaning up expired tokens", e);
        }
    }

    /**
     * Check if user is verified
     */
    public boolean isUserVerified(String userId) {
        Optional<EmailVerificationToken> tokenOpt = tokenRepository.findByUserId(userId);
        return tokenOpt.isPresent() && tokenOpt.get().getUser().getIsVerified();
    }
}
